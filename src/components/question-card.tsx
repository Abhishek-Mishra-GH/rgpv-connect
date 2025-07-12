import type { Question } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import type { Timestamp } from 'firebase/firestore';

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

  return (
    <Card className="p-4 hover:bg-muted/50 transition-colors">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1">
          <Button variant="ghost" size="sm" className="flex flex-col h-auto px-2 py-1">
            <ArrowUp className="h-5 w-5" />
            <span className="text-sm font-bold">{question.upvotes}</span>
          </Button>
        </div>
        <div className="flex-1">
          <h3 className="font-headline text-lg font-semibold">
            <Link href="#" className="hover:text-primary transition-colors">{question.title}</Link>
          </h3>
          <p className="text-muted-foreground text-sm mt-1">{question.summary}</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={question.author.avatarUrl} alt={question.author.name} data-ai-hint="user avatar" />
                <AvatarFallback>{question.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{question.author.name}</span> asked {formatDistanceToNow(getCreatedAtDate(question.createdAt), { addSuffix: true })}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {question.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <MessageSquare className="h-4 w-4" />
                <span>{question.answerCount} Answers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
