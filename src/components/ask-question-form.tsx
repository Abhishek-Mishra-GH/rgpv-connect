"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { summarizeQuestion } from "@/ai/flows/summarize-question";
import { answerQuestion } from "@/ai/flows/answer-question";
import { createQuestionWithAIAnswer } from "@/lib/firestore-actions";
import { useAuth } from "./auth-provider";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Loader2, Bot } from "lucide-react";

const askQuestionFormSchema = z.object({
  title: z
    .string()
    .min(15, {
      message: "Title must be at least 15 characters.",
    })
    .max(150, {
      message: "Title must not be longer than 150 characters.",
    }),
  body: z.string().min(30, {
    message: "Question body must be at least 30 characters.",
  }),
  summary: z.string().optional(),
  tags: z.string().min(1, {
    message: "Please add at least one tag.",
  }),
});

type AskQuestionFormValues = z.infer<typeof askQuestionFormSchema>;

export function AskQuestionForm() {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, userProfile } = useAuth();

  const form = useForm<AskQuestionFormValues>({
    resolver: zodResolver(askQuestionFormSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      body: "",
      summary: "",
      tags: "",
    },
  });

  const handleSummarize = async () => {
    const questionBody = form.getValues("body");
    if (!questionBody || questionBody.length < 50) {
      toast({
        title: "Content too short",
        description:
          "Please write a more detailed question body (at least 50 characters) to generate a summary.",
        variant: "destructive",
      });
      return;
    }

    setIsSummarizing(true);
    try {
      const result = await summarizeQuestion({ question: questionBody });
      form.setValue("summary", result.summary, { shouldValidate: true });
      toast({
        title: "Summary Generated!",
        description: "An AI-powered summary has been added to your question.",
      });
    } catch (error) {
      console.error("Failed to summarize question:", error);
      toast({
        title: "Error",
        description: "Could not generate a summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  async function onSubmit(data: AskQuestionFormValues) {
    if (!user || !userProfile) {
      toast({
        title: "Please log in to post a question.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // Generate AI answer first
      const aiResponse = await answerQuestion({
        title: data.title,
        body: data.body,
      });

      // Create question with AI answer using server action
      const result = await createQuestionWithAIAnswer(
        {
          title: data.title,
          body: data.body,
          summary: data.summary || data.body.substring(0, 150),
          tags: data.tags.split(",").map((tag) => tag.trim()),
          authorId: user.uid,
          authorName: userProfile.name,
          authorAvatarUrl: userProfile.avatarUrl,
        },
        aiResponse.answer
      );

      if (result.success && result.questionId) {
        toast({
          title: "Question Posted!",
          description:
            "Your question is live and has an initial AI-generated answer.",
        });
        form.reset({ title: "", body: "", tags: "", summary: "" });
        router.push(`/question/${result.questionId}`);
        router.refresh();
      } else {
        throw new Error(result.error || "Failed to create question");
      }
    } catch (error) {
      console.error("Failed to post question:", error);
      toast({
        title: "Error",
        description: "Could not post your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., How to prepare for Data Structures exam?"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Be specific and imagine you’re asking a question to another
                person.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Include all the information someone would need to answer your question."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>AI Summary (Optional)</FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSummarize}
                  disabled={isSummarizing || isSubmitting}
                >
                  {isSummarizing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Generate with AI
                </Button>
              </div>
              <FormControl>
                <Textarea
                  placeholder="A short summary of your question will appear here."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This summary helps others quickly understand your question. You
                can edit it after generation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., cse, 5th-sem, data-structures"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Add up to 5 tags to describe what your question is about. Use
                commas to separate tags.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting || !user}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Post Your Question
        </Button>
      </form>
    </Form>
  );
}
