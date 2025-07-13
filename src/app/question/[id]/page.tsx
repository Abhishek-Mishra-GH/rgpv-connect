import { getQuestionAndAnswers } from "@/lib/firestore-actions";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import type { Timestamp } from "firebase/firestore";
import { Bot, ChevronDown, MessageSquare } from "lucide-react";
import { AnswerForm } from "@/components/answer-form";
import { QuestionVoting, AnswerVoting } from "@/components/vote-components";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const getDisplayDate = (createdAt: Date | Timestamp): Date => {
  if (createdAt instanceof Date) {
    return createdAt;
  }
  return createdAt.toDate();
};

function GeminiLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
      <path fill="#8E8FFA" d="M96 128a32 32 0 1 1-64 0 32 32 0 0 1 64 0" />
      <path
        fill="#8E8FFA"
        d="m143.87 32.13l-47.74 82.69l47.74 82.69c42.2-24.36 42.2-141.02 0-165.38"
      />
      <path
        fill="#4285F4"
        d="M143.87 32.13c-42.2 24.36-42.2 141.02 0 165.38C101.67 221.87 32 181.67 32 128c0-53.67 69.67-93.87 111.87-63.74"
        opacity="0.5"
      />
    </svg>
  );
}

export default async function QuestionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { question, answers } = await getQuestionAndAnswers(params.id);

  if (!question) {
    notFound();
  }

  const aiAnswer = answers.find((a) => a.author.id === "ai-assistant");
  const userAnswers = answers.filter((a) => a.author.id !== "ai-assistant");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl md:text-3xl font-bold font-headline">
            {question.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2 mb-6">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={question.author.avatarUrl}
                alt={question.author.name}
              />
              <AvatarFallback>{question.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>
              Asked by{" "}
              <span className="font-medium text-foreground">
                {question.author.name}
              </span>
            </span>
            <span>&bull;</span>
            <span>
              {formatDistanceToNow(getDisplayDate(question.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          <Separator className="mb-6" />

          <div className="flex flex-col md:flex-row gap-8">
            {/* Desktop vote buttons */}
            <div className="hidden md:flex flex-col items-center gap-1 text-muted-foreground w-12">
              <QuestionVoting
                questionId={params.id}
                upvoteCount={question.upvotes}
                layout="vertical"
              />
            </div>
            <div className="prose dark:prose-invert max-w-none prose-p:text-foreground/90 flex-1">
              <p>{question.body}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {question.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Mobile vote/answer count bar */}
          <div className="md:hidden flex items-center justify-between mt-6 pt-4 border-t">
            <QuestionVoting
              questionId={params.id}
              upvoteCount={question.upvotes}
              layout="horizontal"
            />
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">
                {answers.length} Answer{answers.length !== 1 && "s"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold font-headline">Your Answer</h3>
        </CardHeader>
        <CardContent>
          <AnswerForm questionId={params.id} />
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold font-headline">
        {answers.length} Answer{answers.length !== 1 && "s"}
      </h2>

      <div className="space-y-6">
        {aiAnswer && (
          <Card key={aiAnswer.id} className="bg-card border-primary/30">
            <CardHeader className="p-4 border-b">
              <div className="flex items-center gap-2">
                <GeminiLogo className="h-5 w-5" />
                <span className="font-semibold text-sm text-primary">
                  AI Guide
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <Avatar className="h-6 w-6 bg-primary/20 text-primary">
                  <Bot className="h-4 w-4" />
                </Avatar>
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-foreground">
                    {aiAnswer.author.name}
                  </span>
                  <span>
                    {" "}
                    &middot; Generated{" "}
                    {formatDistanceToNow(getDisplayDate(aiAnswer.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

              {/* Mobile voting buttons - below author info */}
              <div className="sm:hidden mb-4 pb-4 border-b border-border/50">
                <AnswerVoting
                  answerId={aiAnswer.id}
                  upvoteCount={aiAnswer.upvotes}
                  layout="horizontal"
                />
              </div>

              <div className="flex-1 overflow-hidden">
                <Collapsible>
                  <div className="prose dark:prose-invert max-w-none text-card-foreground prose-p:text-card-foreground/90 line-clamp-3 break-words">
                    <p>{aiAnswer.body}</p>
                  </div>
                  <CollapsibleContent className="prose dark:prose-invert max-w-none text-card-foreground prose-p:text-card-foreground/90 mt-4 break-words">
                    <p>{aiAnswer.body}</p>
                  </CollapsibleContent>
                  <CollapsibleTrigger asChild>
                    <Button variant="link" className="p-0 h-auto text-sm mt-2">
                      View full answer
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </CollapsibleTrigger>
                </Collapsible>

                {/* Desktop voting buttons - below content */}
                <div className="hidden sm:flex items-center gap-2 mt-4 pt-4 border-t">
                  <AnswerVoting
                    answerId={aiAnswer.id}
                    upvoteCount={aiAnswer.upvotes}
                    layout="horizontal"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {userAnswers.map((answer) => (
          <Card key={answer.id}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={answer.author.avatarUrl}
                    alt={answer.author.name}
                  />
                  <AvatarFallback>
                    {answer.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-foreground">
                    {answer.author.name}
                  </span>
                  <span>
                    {" "}
                    &middot; Answered{" "}
                    {formatDistanceToNow(getDisplayDate(answer.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

              {/* Mobile voting buttons - below author info */}
              <div className="sm:hidden mb-4 pb-4 border-b border-border/50">
                <AnswerVoting
                  answerId={answer.id}
                  upvoteCount={answer.upvotes}
                  layout="horizontal"
                />
              </div>

              <div className="flex-1">
                <div className="prose dark:prose-invert max-w-none text-card-foreground prose-p:text-card-foreground/90 break-words">
                  <p>{answer.body}</p>
                </div>

                {/* Desktop voting buttons - below content */}
                <div className="hidden sm:flex items-center gap-2 mt-4 pt-4 border-t">
                  <AnswerVoting
                    answerId={answer.id}
                    upvoteCount={answer.upvotes}
                    layout="horizontal"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
