"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuestionCard } from "@/components/question-card";
import { QuestionFeedSkeleton } from "@/components/question-feed-skeleton";
import { getQuestions } from "@/lib/firestore-actions";
import type { Question } from "@/types";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function HomePageClient() {
  const [activeTab, setActiveTab] = useState<
    "latest" | "popular" | "unanswered"
  >("latest");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadQuestions = async (filter: "latest" | "popular" | "unanswered") => {
    setIsLoading(true);
    try {
      const data = await getQuestions(filter);
      setQuestions(data);
    } catch (error) {
      console.error("Error loading questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions(activeTab);
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    const tab = value as "latest" | "popular" | "unanswered";
    setActiveTab(tab);
  };

  const getTabDescription = (tab: string) => {
    switch (tab) {
      case "latest":
        return "Browse the most recent questions from the community.";
      case "popular":
        return "Check out the most discussed questions in the community.";
      case "unanswered":
        return "Help the community! These questions only have AI answers and need human responses.";
      default:
        return "";
    }
  };

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case "latest":
        return "Latest Questions";
      case "popular":
        return "Popular Questions";
      case "unanswered":
        return "Unanswered Questions";
      default:
        return "";
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="latest" disabled={isLoading}>
            {isLoading && activeTab === "latest" ? (
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            ) : null}
            Latest
          </TabsTrigger>
          <TabsTrigger value="popular" disabled={isLoading}>
            {isLoading && activeTab === "popular" ? (
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            ) : null}
            Popular
          </TabsTrigger>
          <TabsTrigger value="unanswered" disabled={isLoading}>
            {isLoading && activeTab === "unanswered" ? (
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            ) : null}
            Unanswered
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value={activeTab}>
        <Card>
          <CardHeader>
            <CardTitle>{getTabTitle(activeTab)}</CardTitle>
            <CardDescription>{getTabDescription(activeTab)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <QuestionFeedSkeleton />
            ) : questions.length === 0 ? (
              <p className="text-muted-foreground p-8 text-center">
                {activeTab === "unanswered"
                  ? "No unanswered questions right now!"
                  : "No questions found."}
              </p>
            ) : (
              questions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
