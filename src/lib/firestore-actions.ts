// src/lib/firestore-actions.ts
'use server';

import { db } from '@/lib/firebase';
import type { Question, UserProfile } from '@/types';
import { collection, getDocs, query, orderBy, where, limit } from 'firebase/firestore';

// Helper to convert Firestore timestamp to Date
const convertTimestamp = (data: any) => {
  if (data.createdAt?.toDate) {
    return { ...data, createdAt: data.createdAt.toDate().toISOString() };
  }
  return data;
};

export async function getQuestions(filter: 'latest' | 'popular' | 'unanswered'): Promise<Question[]> {
  try {
    const questionsCol = collection(db, 'questions');
    let q;

    switch (filter) {
      case 'popular':
        q = query(questionsCol, orderBy('upvotes', 'desc'));
        break;
      case 'unanswered':
        q = query(questionsCol, where('answerCount', '==', 0), orderBy('createdAt', 'desc'));
        break;
      case 'latest':
      default:
        q = query(questionsCol, orderBy('createdAt', 'desc'));
        break;
    }

    const querySnapshot = await getDocs(q);
    const questions = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Ensure createdAt is a serializable format (string)
      const serializableData = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      };
      return serializableData as Question;
    });

    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
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
