// src/lib/firestore-actions.ts
"use server";

import { db } from "@/lib/firebase";
import { adminDb, FieldValue } from "@/lib/firebase-admin";
import type { Question, UserProfile, Answer } from "@/types";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  QueryConstraint,
  getDoc,
  doc,
  increment,
  updateDoc,
  writeBatch,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function getQuestions(
  filter: "latest" | "popular" | "unanswered"
): Promise<Question[]> {
  try {
    const questionsCol = collection(db, "questions");
    let constraints: QueryConstraint[];

    switch (filter) {
      case "popular":
        constraints = [orderBy("upvotes", "desc")];
        break;
      case "unanswered":
        // Get questions that have 0 or 1 answers (no human answers)
        // We'll do two separate queries and combine them
        const noAnswersQuery = query(
          questionsCol,
          where("answerCount", "==", 0),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        const aiOnlyQuery = query(
          questionsCol,
          where("answerCount", "==", 1),
          orderBy("createdAt", "desc"),
          limit(10)
        );

        const [noAnswersSnapshot, aiOnlySnapshot] = await Promise.all([
          getDocs(noAnswersQuery),
          getDocs(aiOnlyQuery),
        ]);

        const questions = [
          ...noAnswersSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate
                ? data.createdAt.toDate()
                : new Date(),
            } as Question;
          }),
          ...aiOnlySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate
                ? data.createdAt.toDate()
                : new Date(),
            } as Question;
          }),
        ];

        // Sort by creation date and limit to 20
        return questions
          .sort((a, b) => {
            const aTime =
              a.createdAt instanceof Date
                ? a.createdAt.getTime()
                : a.createdAt.toDate().getTime();
            const bTime =
              b.createdAt instanceof Date
                ? b.createdAt.getTime()
                : b.createdAt.toDate().getTime();
            return bTime - aTime;
          })
          .slice(0, 20);

      case "latest":
      default:
        constraints = [orderBy("createdAt", "desc")];
        break;
    }

    const q = query(questionsCol, ...constraints, limit(20));
    const querySnapshot = await getDocs(q);

    const questions = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate()
          : new Date(),
      } as Question;
    });

    return questions;
  } catch (error) {
    console.error(`Error fetching questions with filter '${filter}':`, error);
    return [];
  }
}

export async function getQuestionAndAnswers(
  questionId: string
): Promise<{ question: Question | null; answers: Answer[] }> {
  try {
    const questionRef = doc(db, "questions", questionId);
    const questionSnap = await getDoc(questionRef);

    if (!questionSnap.exists()) {
      return { question: null, answers: [] };
    }

    const questionData = questionSnap.data();
    const question = {
      id: questionSnap.id,
      ...questionData,
      createdAt: questionData.createdAt?.toDate
        ? questionData.createdAt.toDate()
        : new Date(),
    } as Question;

    const answersCol = collection(db, "answers");
    const q = query(
      answersCol,
      where("questionId", "==", questionId),
      orderBy("upvotes", "desc"),
      orderBy("createdAt", "asc")
    );
    const answersSnapshot = await getDocs(q);

    const answers = answersSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate()
          : new Date(),
      } as Answer;
    });

    return { question, answers };
  } catch (error) {
    console.error("Error fetching question and answers:", error);
    return { question: null, answers: [] };
  }
}

export async function upvoteQuestion(
  questionId: string,
  userId: string,
  path: string
) {
  if (!userId) {
    throw new Error("User must be authenticated to vote");
  }

  const voteId = `${userId}_${questionId}`;
  const voteRef = adminDb.collection("questionVotes").doc(voteId);
  const questionRef = adminDb.collection("questions").doc(questionId);

  try {
    const voteDoc = await voteRef.get();

    if (voteDoc.exists) {
      const currentVote = voteDoc.data()?.voteType;

      if (currentVote === "up") {
        // User already upvoted, remove the vote
        await adminDb.runTransaction(async (transaction) => {
          transaction.delete(voteRef);
          transaction.update(questionRef, {
            upvotes: FieldValue.increment(-1),
          });
        });
      } else if (currentVote === "down") {
        // User previously downvoted, change to upvote
        await adminDb.runTransaction(async (transaction) => {
          transaction.update(voteRef, {
            voteType: "up",
            updatedAt: new Date(),
          });
          transaction.update(questionRef, { upvotes: FieldValue.increment(2) }); // +1 to remove downvote, +1 to add upvote
        });
      }
    } else {
      // User hasn't voted yet, create new upvote
      await adminDb.runTransaction(async (transaction) => {
        transaction.set(voteRef, {
          userId,
          questionId,
          voteType: "up",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        transaction.update(questionRef, { upvotes: FieldValue.increment(1) });
      });
    }
  } catch (error) {
    console.error("Error upvoting question:", error);
    throw error;
  }

  revalidatePath(path);
}

export async function downvoteQuestion(
  questionId: string,
  userId: string,
  path: string
) {
  if (!userId) {
    throw new Error("User must be authenticated to vote");
  }

  const voteId = `${userId}_${questionId}`;
  const voteRef = adminDb.collection("questionVotes").doc(voteId);
  const questionRef = adminDb.collection("questions").doc(questionId);

  try {
    const voteDoc = await voteRef.get();

    if (voteDoc.exists) {
      const currentVote = voteDoc.data()?.voteType;

      if (currentVote === "down") {
        // User already downvoted, remove the vote
        await adminDb.runTransaction(async (transaction) => {
          transaction.delete(voteRef);
          transaction.update(questionRef, { upvotes: FieldValue.increment(1) });
        });
      } else if (currentVote === "up") {
        // User previously upvoted, change to downvote
        await adminDb.runTransaction(async (transaction) => {
          transaction.update(voteRef, {
            voteType: "down",
            updatedAt: new Date(),
          });
          transaction.update(questionRef, {
            upvotes: FieldValue.increment(-2),
          }); // -1 to remove upvote, -1 to add downvote
        });
      }
    } else {
      // User hasn't voted yet, create new downvote
      await adminDb.runTransaction(async (transaction) => {
        transaction.set(voteRef, {
          userId,
          questionId,
          voteType: "down",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        transaction.update(questionRef, { upvotes: FieldValue.increment(-1) });
      });
    }
  } catch (error) {
    console.error("Error downvoting question:", error);
    throw error;
  }

  revalidatePath(path);
}

export async function upvoteAnswer(
  answerId: string,
  userId: string,
  path: string
) {
  if (!userId) {
    throw new Error("User must be authenticated to vote");
  }

  const voteId = `${userId}_${answerId}`;
  const voteRef = adminDb.collection("answerVotes").doc(voteId);
  const answerRef = adminDb.collection("answers").doc(answerId);

  try {
    const voteDoc = await voteRef.get();

    if (voteDoc.exists) {
      const currentVote = voteDoc.data()?.voteType;

      if (currentVote === "up") {
        // User already upvoted, remove the vote
        await adminDb.runTransaction(async (transaction) => {
          transaction.delete(voteRef);
          transaction.update(answerRef, { upvotes: FieldValue.increment(-1) });
        });
      } else if (currentVote === "down") {
        // User previously downvoted, change to upvote
        await adminDb.runTransaction(async (transaction) => {
          transaction.update(voteRef, {
            voteType: "up",
            updatedAt: new Date(),
          });
          transaction.update(answerRef, { upvotes: FieldValue.increment(2) }); // +1 to remove downvote, +1 to add upvote
        });
      }
    } else {
      // User hasn't voted yet, create new upvote
      await adminDb.runTransaction(async (transaction) => {
        transaction.set(voteRef, {
          userId,
          answerId,
          voteType: "up",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        transaction.update(answerRef, { upvotes: FieldValue.increment(1) });
      });
    }
  } catch (error) {
    console.error("Error upvoting answer:", error);
    throw error;
  }

  revalidatePath(path);
}

export async function downvoteAnswer(
  answerId: string,
  userId: string,
  path: string
) {
  if (!userId) {
    throw new Error("User must be authenticated to vote");
  }

  const voteId = `${userId}_${answerId}`;
  const voteRef = adminDb.collection("answerVotes").doc(voteId);
  const answerRef = adminDb.collection("answers").doc(answerId);

  try {
    const voteDoc = await voteRef.get();

    if (voteDoc.exists) {
      const currentVote = voteDoc.data()?.voteType;

      if (currentVote === "down") {
        // User already downvoted, remove the vote
        await adminDb.runTransaction(async (transaction) => {
          transaction.delete(voteRef);
          transaction.update(answerRef, { upvotes: FieldValue.increment(1) });
        });
      } else if (currentVote === "up") {
        // User previously upvoted, change to downvote
        await adminDb.runTransaction(async (transaction) => {
          transaction.update(voteRef, {
            voteType: "down",
            updatedAt: new Date(),
          });
          transaction.update(answerRef, { upvotes: FieldValue.increment(-2) }); // -1 to remove upvote, -1 to add downvote
        });
      }
    } else {
      // User hasn't voted yet, create new downvote
      await adminDb.runTransaction(async (transaction) => {
        transaction.set(voteRef, {
          userId,
          answerId,
          voteType: "down",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        transaction.update(answerRef, { upvotes: FieldValue.increment(-1) });
      });
    }
  } catch (error) {
    console.error("Error downvoting answer:", error);
    throw error;
  }

  revalidatePath(path);
}

export async function createQuestionWithAIAnswer(
  questionData: {
    title: string;
    body: string;
    summary?: string;
    tags: string[];
    authorId: string;
    authorName: string;
    authorAvatarUrl: string;
  },
  aiAnswerBody: string
): Promise<{ success: boolean; questionId?: string; error?: string }> {
  try {
    const batch = adminDb.batch();

    // 1. Create the question document
    const questionRef = adminDb.collection("questions").doc();
    batch.set(questionRef, {
      title: questionData.title,
      body: questionData.body,
      summary: questionData.summary || questionData.body.substring(0, 150),
      tags: questionData.tags,
      author: {
        id: questionData.authorId,
        name: questionData.authorName,
        avatarUrl: questionData.authorAvatarUrl,
      },
      createdAt: new Date(),
      answerCount: 1, // Start with the AI answer
      upvotes: 0,
    });

    // 2. Create the AI answer document
    const answerRef = adminDb.collection("answers").doc();
    batch.set(answerRef, {
      questionId: questionRef.id,
      body: aiAnswerBody,
      author: {
        id: "ai-assistant",
        name: "AI Assistant",
        avatarUrl: "",
      },
      createdAt: new Date(),
      upvotes: 0,
    });

    await batch.commit();

    return { success: true, questionId: questionRef.id };
  } catch (error) {
    console.error("Failed to create question with AI answer:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function createAnswer(answerData: {
  questionId: string;
  body: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await adminDb.collection("answers").add({
      questionId: answerData.questionId,
      body: answerData.body,
      author: {
        id: answerData.authorId,
        name: answerData.authorName,
        avatarUrl: answerData.authorAvatarUrl,
      },
      createdAt: new Date(),
      upvotes: 0,
    });

    // Increment the answer count on the question
    const questionRef = adminDb
      .collection("questions")
      .doc(answerData.questionId);
    await questionRef.update({
      answerCount: FieldValue.increment(1),
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to create answer:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getUserQuestionVote(
  questionId: string,
  userId: string
): Promise<"up" | "down" | null> {
  if (!userId) return null;

  try {
    const voteId = `${userId}_${questionId}`;
    const voteDoc = await adminDb.collection("questionVotes").doc(voteId).get();

    if (voteDoc.exists) {
      return voteDoc.data()?.voteType || null;
    }
    return null;
  } catch (error) {
    console.error("Error getting user question vote:", error);
    return null;
  }
}

export async function getUserAnswerVote(
  answerId: string,
  userId: string
): Promise<"up" | "down" | null> {
  if (!userId) return null;

  try {
    const voteId = `${userId}_${answerId}`;
    const voteDoc = await adminDb.collection("answerVotes").doc(voteId).get();

    if (voteDoc.exists) {
      return voteDoc.data()?.voteType || null;
    }
    return null;
  } catch (error) {
    console.error("Error getting user answer vote:", error);
    return null;
  }
}
