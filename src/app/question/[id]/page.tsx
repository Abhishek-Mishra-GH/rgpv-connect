import { getQuestionAndAnswers } from "@/lib/firestore-actions";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import type { Timestamp } from "firebase/firestore";
import { Bot } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AnswerForm } from "@/components/answer-form";
import { VoteButton } from "@/components/vote-button";
import { upvoteQuestion, downvoteQuestion, upvoteAnswer, downvoteAnswer } from "@/lib/firestore-actions";

const getDisplayDate = (createdAt: Date | Timestamp): Date => {
    if (createdAt instanceof Date) {
      return createdAt;
    }
    return createdAt.toDate();
}

export default async function QuestionDetailPage({ params }: { params: { id: string } }) {
    const { question, answers } = await getQuestionAndAnswers(params.id);

    if (!question) {
        notFound();
    }

    const path = `/question/${params.id}`;
    const handleQuestionUpvote = upvoteQuestion.bind(null, params.id, path);
    const handleQuestionDownvote = downvoteQuestion.bind(null, params.id, path);

    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <div className="flex gap-2 mb-2">
                        {question.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                    <h1 className="text-3xl font-bold font-headline">{question.title}</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={question.author.avatarUrl} alt={question.author.name} />
                            <AvatarFallback>{question.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>
                            Asked by <span className="font-medium text-foreground">{question.author.name}</span>
                        </span>
                        <span>&bull;</span>
                        <span>{formatDistanceToNow(getDisplayDate(question.createdAt), { addSuffix: true })}</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="prose dark:prose-invert max-w-none prose-p:text-foreground/90">
                        <p>{question.body}</p>
                    </div>
                </CardContent>
                <CardFooter className="gap-2">
                    <form action={handleQuestionUpvote}>
                         <VoteButton type="up" voteCount={question.upvotes} />
                    </form>
                    <form action={handleQuestionDownvote}>
                         <VoteButton type="down" />
                    </form>
                </CardFooter>
            </Card>

            <h2 className="text-2xl font-bold font-headline mt-8 mb-4">{answers.length} Answer{answers.length !== 1 && 's'}</h2>
            
            <div className="space-y-6">
                {answers.map(answer => (
                    <Card key={answer.id} className={`bg-card ${answer.author.id === 'ai-assistant' ? 'border-primary/30' : ''}`}>
                        <CardContent className="p-0">
                            <div className="flex gap-4 p-6">
                                <div className="flex flex-col items-center gap-1 text-muted-foreground w-12">
                                     <form action={upvoteAnswer.bind(null, answer.id, path)}>
                                        <VoteButton type="up" />
                                     </form>
                                     <span className="text-base font-bold text-foreground">{answer.upvotes}</span>
                                     <form action={downvoteAnswer.bind(null, answer.id, path)}>
                                        <VoteButton type="down" />
                                    </form>
                                </div>
                                <div className="flex-1">
                                    <div className="prose dark:prose-invert max-w-none text-card-foreground prose-p:text-card-foreground/90">
                                        <p>{answer.body}</p>
                                    </div>
                                    <div className="flex items-center justify-end mt-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            {answer.author.id === 'ai-assistant' ? (
                                                <>
                                                    <Avatar className="h-8 w-8 bg-primary/20 text-primary">
                                                        <Bot className="h-5 w-5" />
                                                    </Avatar>
                                                    <div>
                                                        <span className="font-medium text-foreground">{answer.author.name}</span>
                                                        <p>Generated {formatDistanceToNow(getDisplayDate(answer.createdAt), { addSuffix: true })}</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={answer.author.avatarUrl} alt={answer.author.name} />
                                                        <AvatarFallback>{answer.author.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <span className="font-medium text-foreground">{answer.author.name}</span>
                                                        <p>Answered {formatDistanceToNow(getDisplayDate(answer.createdAt), { addSuffix: true })}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Separator className="my-8" />
            
            <Card>
                <CardHeader>
                    <h3 className="text-xl font-bold font-headline">Your Answer</h3>
                </CardHeader>
                <CardContent>
                    <AnswerForm questionId={params.id} />
                </CardContent>
            </Card>
        </div>
    );
}
