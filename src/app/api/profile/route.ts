'use server';

import {NextResponse} from 'next/server';
import type {UserProfile} from '@/types';

// Simulate a database for the current user's profile
let userProfile: UserProfile = {
  id: 'current-user',
  name: 'Priya Singh',
  email: 'priya.singh@example.com',
  avatarUrl: 'https://placehold.co/100x100.png',
  course: null,
  branch: null,
  year: null,
  isProfileComplete: false,
};

export async function GET() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return NextResponse.json(userProfile);
}

export async function PUT(request: Request) {
  const data = await request.json();
  userProfile = {
    ...userProfile,
    ...data,
    isProfileComplete: true, // Mark as complete after first update
  };
  console.log('Updated user profile:', userProfile);
  return NextResponse.json(userProfile);
}
