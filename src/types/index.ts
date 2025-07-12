import type { Timestamp } from "firebase/firestore";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  course: 'B.Tech' | 'M.Tech' | 'MCA' | 'B.Pharma' | 'MBA' | null;
  branch: string | null;
  year: number | null;
  isProfileComplete: boolean;
};

export type Question = {
  id: string;
  title: string;
  summary: string;
  body: string;
  author: Pick<UserProfile, 'id' | 'name' | 'avatarUrl'>;
  tags: string[];
  createdAt: Date | Timestamp;
  answerCount: number;
  upvotes: number;
};

export type Answer = {
    id: string;
    questionId: string;
    body: string;
    author: Pick<UserProfile, 'id' | 'name' | 'avatarUrl'>;
    createdAt: Date | Timestamp;
    upvotes: number;
};
