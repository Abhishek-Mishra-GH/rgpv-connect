// src/lib/firestore-actions.ts
'use server';

import { db } from '@/lib/firebase';
import type { Question, UserProfile } from '@/types';
import { collection, getDocs, query, orderBy, where, limit, QueryConstraint } from 'firebase/firestore';

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

    const q = query(questionsCol, ...constraints);
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
