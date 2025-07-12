import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { QuestionCard } from '@/components/question-card';
import { Suspense } from 'react';
import { QuestionFeedSkeleton } from '@/components/question-feed-skeleton';
import { getQuestions } from '@/lib/firestore-actions';
import type { Question } from '@/types';


async function QuestionFeed({ filter }: { filter: 'latest' | 'popular' | 'unanswered' }) {
  const questions: Question[] = await getQuestions(filter);
  
  if (questions.length === 0) {
     return <p className="text-muted-foreground p-8 text-center">
      {filter === 'unanswered' 
        ? "No unanswered questions right now!" 
        : "No questions found."}
    </p>;
  }
  
  return questions.map((question) => (
    <QuestionCard key={question.id} question={question} />
  ));
}

export default function HomePage() {
  return (
    <Tabs defaultValue="latest">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="latest">Latest</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="latest">
        <Card>
          <CardHeader>
            <CardTitle>Latest Questions</CardTitle>
            <CardDescription>
              Browse the most recent questions from the community.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Suspense fallback={<QuestionFeedSkeleton />}>
              <QuestionFeed filter="latest" />
            </Suspense>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="popular">
      <Card>
          <CardHeader>
            <CardTitle>Popular Questions</CardTitle>
            <CardDescription>
              Check out the most discussed questions in the community.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Suspense fallback={<QuestionFeedSkeleton />}>
              <QuestionFeed filter="popular" />
            </Suspense>
          </CardContent>
        </Card>
      </TabsContent>
       <TabsContent value="unanswered">
      <Card>
          <CardHeader>
            <CardTitle>Unanswered Questions</CardTitle>
            <CardDescription>
             Be the first to help out! These questions are waiting for an answer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Suspense fallback={<QuestionFeedSkeleton />}>
              <QuestionFeed filter="unanswered" />
            </Suspense>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
