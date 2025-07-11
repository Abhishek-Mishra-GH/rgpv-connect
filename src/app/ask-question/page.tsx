import { AskQuestionForm } from "@/components/ask-question-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AskQuestionPage() {
    return (
        <div className="mx-auto max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle>Ask a New Question</CardTitle>
                    <CardDescription>
                        Get help from the community. Be specific and imagine you’re asking a question to another person.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AskQuestionForm />
                </CardContent>
            </Card>
        </div>
    )
}
