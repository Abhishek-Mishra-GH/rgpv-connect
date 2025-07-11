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
import { dummyQuestions } from '@/lib/data';
import { QuestionCard } from '@/components/question-card';
import { Suspense } from 'react';
import { QuestionFeedSkeleton } from '@/components/question-feed-skeleton';

async function LatestQuestions() {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1000));
  const questions = dummyQuestions;
  return questions.map((question) => (
    <QuestionCard key={question.id} question={question} />
  ));
}

async function PopularQuestions() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const questions = [...dummyQuestions].sort((a, b) => b.upvotes - a.upvotes);
  return questions.map((question) => (
    <QuestionCard key={question.id} question={question} />
  ));
}

async function UnansweredQuestions() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const questions = dummyQuestions.filter(q => q.answerCount === 0);
  if (questions.length === 0) {
    return <p className="text-muted-foreground p-8 text-center">No unanswered questions right now!</p>;
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
              <LatestQuestions />
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
              <PopularQuestions />
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
              <UnansweredQuestions />
            </Suspense>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
