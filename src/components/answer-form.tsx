"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { addDoc, collection, serverTimestamp, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./auth-provider";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const answerFormSchema = z.object({
  body: z.string().min(20, {
    message: "Answer must be at least 20 characters.",
  }),
});

type AnswerFormValues = z.infer<typeof answerFormSchema>;

export function AnswerForm({ questionId }: { questionId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, userProfile } = useAuth();

  const form = useForm<AnswerFormValues>({
    resolver: zodResolver(answerFormSchema),
    mode: "onChange",
    defaultValues: {
        body: "",
    }
  });

  async function onSubmit(data: AnswerFormValues) {
    if (!user || !userProfile) {
      toast({ title: "Please log in to post an answer.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
        await addDoc(collection(db, "answers"), {
            questionId,
            body: data.body,
            author: {
                id: user.uid,
                name: userProfile.name,
                avatarUrl: userProfile.avatarUrl,
            },
            createdAt: serverTimestamp(),
            upvotes: 0,
        });

        // Increment the answer count on the question
        const questionRef = doc(db, 'questions', questionId);
        await updateDoc(questionRef, {
            answerCount: increment(1)
        });

      toast({
        title: "Answer Posted!",
        description: "Thank you for contributing to the community.",
      });
      form.reset({ body: '' });
      router.refresh();
    } catch (error) {
      console.error("Failed to post answer:", error);
      toast({
        title: "Error",
        description: "Could not post your answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!user || !userProfile) {
    return (
        <div className="text-center text-muted-foreground p-4 border rounded-md">
            You must be logged in to post an answer.
        </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
                <FormItem>
                <FormControl>
                    <Textarea
                    placeholder="Share your knowledge. Be clear and concise."
                    className="min-h-[150px]"
                    {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Post Your Answer
            </Button>
        </div>
      </form>
    </Form>
  );
}
