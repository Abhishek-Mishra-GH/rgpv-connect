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
  author: Pick<UserProfile, 'id' | 'name' | 'avatarUrl'>;
  tags: string[];
  createdAt: Date;
  answerCount: number;
  upvotes: number;
};
