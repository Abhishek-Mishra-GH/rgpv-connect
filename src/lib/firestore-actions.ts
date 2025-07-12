// src/lib/firestore-actions.ts
'use server';

import { db } from '@/lib/firebase';
import type { Question, UserProfile, Answer } from '@/types';
import { collection, getDocs, query, orderBy, where, limit, QueryConstraint, getDoc, doc } from 'firebase/firestore';

export async function getQuestions(filter: 'latest' | 'popular' | 'unanswered'): Promise<Question[]> {
  try {
    const questionsCol = collection(db, 'questions');
    const constraints: QueryConstraint[] = [];

    switch (filter) {
      case 'popular':
        constraints.push(orderBy('upvotes', 'desc'));
        break;
      case 'unanswered':
        constraints.push(where('answerCount', '==', 0), orderBy('createdAt', 'desc'));
        break;
      case 'latest':
      default:
        constraints.push(orderBy('createdAt', 'desc'));
        break;
    }

    const q = query(questionsCol, ...constraints, limit(20));
    const querySnapshot = await getDocs(q);
    
    const questions = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      } as Question;
    });

    return questions;
  } catch (error) {
    console.error(`Error fetching questions with filter '${filter}':`, error);
    return [];
  }
}

export async function getSeniors(): Promise<UserProfile[]> {
  try {
    const seniorsCol = collection(db, 'users');
    const q = query(
      seniorsCol,
      where('isProfileComplete', '==', true),
      orderBy('year', 'asc'),
      limit(20) // Let's limit to 20 for now
    );
    const querySnapshot = await getDocs(q);
    const seniors = querySnapshot.docs.map(doc => doc.data() as UserProfile);
    return seniors;
  } catch (error) {
    console.error("Error fetching seniors:", error);
    return [];
  }
}

export async function getQuestionAndAnswers(questionId: string): Promise<{ question: Question | null, answers: Answer[] }> {
    try {
        const questionRef = doc(db, 'questions', questionId);
        const questionSnap = await getDoc(questionRef);

        if (!questionSnap.exists()) {
            return { question: null, answers: [] };
        }

        const questionData = questionSnap.data();
        const question = {
            id: questionSnap.id,
            ...questionData,
            createdAt: questionData.createdAt?.toDate ? questionData.createdAt.toDate() : new Date(),
        } as Question;

        const answersCol = collection(db, 'answers');
        const q = query(answersCol, where('questionId', '==', questionId), orderBy('createdAt', 'asc'));
        const answersSnapshot = await getDocs(q);

        const answers = answersSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            } as Answer;
        });

        return { question, answers };

    } catch (error) {
        console.error("Error fetching question and answers:", error);
        return { question: null, answers: [] };
    }
}
