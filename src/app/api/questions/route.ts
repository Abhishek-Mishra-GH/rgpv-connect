'use server';

import {NextResponse} from 'next/server';
import {dummyQuestions} from '@/lib/data';
import type {Question} from '@/types';

// Simulate a database operation
let questions: Question[] = [...dummyQuestions];

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const tab = searchParams.get('tab');

  await new Promise(resolve => setTimeout(resolve, 1000));

  let filteredQuestions = [...questions];

  if (tab === 'popular') {
    filteredQuestions.sort((a, b) => b.upvotes - a.upvotes);
  } else if (tab === 'unanswered') {
    filteredQuestions = filteredQuestions.filter(q => q.answerCount === 0);
  } else {
    // latest is default
    filteredQuestions.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  return NextResponse.json(filteredQuestions);
}

export async function POST(request: Request) {
  const newQuestionData = await request.json();

  const newQuestion: Question = {
    id: `q-${Date.now()}`,
    ...newQuestionData,
    author: {
      id: 'current-user',
      name: 'New User',
      avatarUrl: 'https://placehold.co/40x40.png',
    },
    createdAt: new Date(),
    answerCount: 0,
    upvotes: 0,
  };

  questions.unshift(newQuestion);

  console.log('New question posted:', newQuestion);

  return NextResponse.json(
    {message: 'Question posted successfully', question: newQuestion},
    {status: 201}
  );
}
