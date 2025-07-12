import type { Question } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import type { Timestamp } from 'firebase/firestore';
import { upvoteQuestion, downvoteQuestion } from '@/lib/firestore-actions';
import { VoteButton } from './vote-button';

type QuestionCardProps = {
  question: Question;
};

export function QuestionCard({ question }: QuestionCardProps) {
  const getCreatedAtDate = (createdAt: Date | Timestamp): Date => {
    if (createdAt instanceof Date) {
      return createdAt;
    }
    return createdAt.toDate();
  }

  const handleUpvote = upvoteQuestion.bind(null, question.id, '/');
  const handleDownvote = downvoteQuestion.bind(null, question.id, '/');


  return (
    <Card className="hover:border-primary/50 transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-1 text-muted-foreground w-12">
            <form action={handleUpvote}>
              <VoteButton type="up" />
            </form>
            <span className="text-base font-bold text-foreground">{question.upvotes}</span>
            <form action={handleDownvote}>
                <VoteButton type="down" />
            </form>
          </div>
          <div className="flex-1">
            <h3 className="font-headline text-lg font-semibold leading-tight">
              <Link href={`/question/${question.id}`} className="hover:text-primary transition-colors stretched-link">
                {question.title}
              </Link>
            </h3>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{question.summary}</p>
            <div className="flex flex-wrap items-center justify-between mt-4 gap-y-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={question.author.avatarUrl} alt={question.author.name} data-ai-hint="user avatar" />
                  <AvatarFallback>{question.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{question.author.name}</span> &middot; {formatDistanceToNow(getCreatedAtDate(question.createdAt), { addSuffix: true })}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <MessageSquare className="h-4 w-4" />
                  <span>{question.answerCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}