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
            {dummyQuestions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
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
            {[...dummyQuestions].sort((a,b) => b.upvotes - a.upvotes).map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
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
            {dummyQuestions.filter(q => q.answerCount === 0).length > 0 
              ? dummyQuestions.filter(q => q.answerCount === 0).map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))
              : <p className="text-muted-foreground p-8 text-center">No unanswered questions right now!</p>
            }
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
