import type { Question } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import type { Timestamp } from "firebase/firestore";
import { QuestionVoting } from "./vote-components";

type QuestionCardProps = {
  question: Question;
};

export function QuestionCard({ question }: QuestionCardProps) {
  const getCreatedAtDate = (createdAt: Date | Timestamp): Date => {
    if (createdAt instanceof Date) {
      return createdAt;
    }
    return createdAt.toDate();
  };

  return (
    <Card className="hover:border-primary/50 transition-all duration-200 w-full">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:gap-4">
          {/* Desktop vote buttons */}
          <div className="hidden sm:flex flex-col items-center gap-1 text-muted-foreground w-12 flex-shrink-0">
            <QuestionVoting
              questionId={question.id}
              upvoteCount={question.upvotes}
              layout="vertical"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-headline text-base sm:text-lg font-semibold leading-tight break-words">
              <Link
                href={`/question/${question.id}`}
                className="hover:text-primary transition-colors block"
              >
                {question.title}
              </Link>
            </h3>

            <div className="flex items-center gap-2 mt-2 mb-3">
              <Avatar className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0">
                <AvatarImage
                  src={question.author.avatarUrl}
                  alt={question.author.name}
                  data-ai-hint="user avatar"
                />
                <AvatarFallback className="text-xs">
                  {question.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground truncate">
                <span className="font-medium text-foreground">
                  {question.author.name}
                </span>{" "}
                &middot;{" "}
                {formatDistanceToNow(getCreatedAtDate(question.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>

            <p className="text-muted-foreground text-sm mt-2 line-clamp-2 break-words">
              {question.summary}
            </p>

            <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 mb-4">
              {question.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Mobile voting buttons below content */}
            <div className="flex sm:hidden items-center justify-between pt-3 border-t border-border/50">
              <QuestionVoting
                questionId={question.id}
                upvoteCount={question.upvotes}
                layout="horizontal"
              />
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <MessageSquare className="h-4 w-4" />
                  <span>{question.answerCount}</span>
                </div>
                <Button asChild size="sm" variant="outline" className="text-xs">
                  <Link href={`/question/${question.id}`}>
                    View
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Desktop layout */}
            <div className="hidden sm:flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <MessageSquare className="h-4 w-4" />
                  <span>{question.answerCount}</span>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/question/${question.id}`}>
                    See Answers
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
