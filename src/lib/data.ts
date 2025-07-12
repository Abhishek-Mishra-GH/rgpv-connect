import type { Question, UserProfile } from '@/types';

export const dummyQuestions: Question[] = [
  {
    id: '1',
    title: 'How to prepare for 5th-semester Data Structures exam?',
    summary: 'Seeking advice and resources for the upcoming Data Structures (CS-501) exam. What are the most important topics to focus on?',
    author: {
      id: 'senior1',
      name: 'Aarav Sharma',
      avatarUrl: 'https://placehold.co/40x40.png',
    },
    tags: ['B.Tech', 'CSE', '5th Sem'],
    createdAt: new Date('2024-07-20T10:00:00Z'),
    answerCount: 5,
    upvotes: 23,
  },
  {
    id: '2',
    title: 'Best resources for learning React for final year project?',
    summary: 'Looking for recommended tutorials, courses, and documentation for building a web app with React for my final year project.',
    author: {
      id: 'student1',
      name: 'Priya Singh',
      avatarUrl: 'https://placehold.co/40x40.png',
    },
    tags: ['B.Tech', 'IT', 'Project'],
    createdAt: new Date('2024-07-19T14:30:00Z'),
    answerCount: 8,
    upvotes: 42,
  },
  {
    id: '3',
    title: 'Internship opportunities for Mechanical Engineering students?',
    summary: 'What are some good companies that offer internships for 3rd-year Mechanical Engineering students? Any tips on how to apply?',
    author: {
      id: 'student2',
      name: 'Rohan Verma',
      avatarUrl: 'https://placehold.co/40x40.png',
    },
    tags: ['B.Tech', 'ME', 'Internship'],
    createdAt: new Date('2024-07-18T09:00:00Z'),
    answerCount: 3,
    upvotes: 15,
  },
  {
    id: '4',
    title: 'How does the relative grading system work in RGPV?',
    summary: 'Can someone explain the relative grading system? How are grade points calculated based on class performance?',
    author: {
      id: 'student3',
      name: 'Sneha Patil',
      avatarUrl: 'https://placehold.co/40x40.png',
    },
    tags: ['General', 'Grading'],
    createdAt: new Date('2024-07-17T18:00:00Z'),
    answerCount: 12,
    upvotes: 55,
  },
];
