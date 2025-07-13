"use client";

import { useAuth } from "./auth-provider";
import { VoteButton } from "./vote-button";
import {
  upvoteQuestion,
  downvoteQuestion,
  upvoteAnswer,
  downvoteAnswer,
  getUserQuestionVote,
  getUserAnswerVote,
} from "@/lib/firestore-actions";
import { usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface QuestionVotingProps {
  questionId: string;
  upvoteCount?: number;
  downvoteCount?: number;
  layout?: "vertical" | "horizontal";
}

export function QuestionVoting({
  questionId,
  upvoteCount = 0,
  downvoteCount,
  layout = "horizontal",
}: QuestionVotingProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const { toast } = useToast();
  const [currentVote, setCurrentVote] = useState<"up" | "down" | null>(null);
  const [optimisticUpvoteCount, setOptimisticUpvoteCount] =
    useState(upvoteCount);

  useEffect(() => {
    setOptimisticUpvoteCount(upvoteCount);
  }, [upvoteCount]);

  useEffect(() => {
    if (user?.uid) {
      getUserQuestionVote(questionId, user.uid).then(setCurrentVote);
    } else {
      setCurrentVote(null);
    }
  }, [questionId, user?.uid]);

  const handleVote = (voteType: "up" | "down") => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote on questions.",
        variant: "destructive",
      });
      return;
    }

    // Store the previous states for rollback in case of error
    const previousVote = currentVote;
    const previousUpvoteCount = optimisticUpvoteCount;

    // Update UI INSTANTLY - no waiting
    if (voteType === "up") {
      if (currentVote === "up") {
        setCurrentVote(null);
        setOptimisticUpvoteCount((prev) => prev - 1);
      } else {
        setCurrentVote("up");
        if (currentVote === "down") {
          setOptimisticUpvoteCount((prev) => prev + 2); // +1 to remove downvote, +1 to add upvote
        } else {
          setOptimisticUpvoteCount((prev) => prev + 1);
        }
      }
    } else {
      if (currentVote === "down") {
        setCurrentVote(null);
        setOptimisticUpvoteCount((prev) => prev + 1); // Remove downvote effect
      } else {
        setCurrentVote("down");
        if (currentVote === "up") {
          setOptimisticUpvoteCount((prev) => prev - 2); // -1 to remove upvote, -1 to add downvote
        } else {
          setOptimisticUpvoteCount((prev) => prev - 1); // Just add downvote effect
        }
      }
    }

    // Execute database operation in background (non-blocking)
    const performDatabaseUpdate = async () => {
      try {
        if (voteType === "up") {
          await upvoteQuestion(questionId, user.uid, pathname);
        } else {
          await downvoteQuestion(questionId, user.uid, pathname);
        }
      } catch (error) {
        console.error("Error voting:", error);
        // Rollback optimistic update on error
        setCurrentVote(previousVote);
        setOptimisticUpvoteCount(previousUpvoteCount);
        toast({
          title: "Error",
          description: "Failed to register your vote. Please try again.",
          variant: "destructive",
        });
      }
    };

    // Start background update without blocking UI
    performDatabaseUpdate();
  };

  const isVertical = layout === "vertical";

  return (
    <div
      className={`flex ${
        isVertical ? "flex-col" : "flex-row"
      } items-center gap-2`}
    >
      <form action={() => handleVote("up")}>
        <VoteButton
          type="up"
          isActive={currentVote === "up"}
          isLoading={false}
        />
      </form>

      <span
        className={`${
          isVertical ? "text-lg" : "text-sm"
        } font-bold text-foreground min-w-[1.5rem] text-center`}
      >
        {optimisticUpvoteCount}
      </span>

      <form action={() => handleVote("down")}>
        <VoteButton
          type="down"
          isActive={currentVote === "down"}
          isLoading={false}
        />
      </form>
    </div>
  );
}

interface AnswerVotingProps {
  answerId: string;
  upvoteCount?: number;
  downvoteCount?: number;
  layout?: "vertical" | "horizontal";
}

export function AnswerVoting({
  answerId,
  upvoteCount = 0,
  downvoteCount,
  layout = "horizontal",
}: AnswerVotingProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const { toast } = useToast();
  const [currentVote, setCurrentVote] = useState<"up" | "down" | null>(null);
  const [optimisticUpvoteCount, setOptimisticUpvoteCount] =
    useState(upvoteCount);

  useEffect(() => {
    setOptimisticUpvoteCount(upvoteCount);
  }, [upvoteCount]);

  useEffect(() => {
    if (user?.uid) {
      getUserAnswerVote(answerId, user.uid).then(setCurrentVote);
    } else {
      setCurrentVote(null);
    }
  }, [answerId, user?.uid]);

  const handleVote = (voteType: "up" | "down") => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote on answers.",
        variant: "destructive",
      });
      return;
    }

    // Store the previous states for rollback in case of error
    const previousVote = currentVote;
    const previousUpvoteCount = optimisticUpvoteCount;

    // Update UI INSTANTLY - no waiting
    if (voteType === "up") {
      if (currentVote === "up") {
        setCurrentVote(null);
        setOptimisticUpvoteCount((prev) => prev - 1);
      } else {
        setCurrentVote("up");
        if (currentVote === "down") {
          setOptimisticUpvoteCount((prev) => prev + 2); // +1 to remove downvote, +1 to add upvote
        } else {
          setOptimisticUpvoteCount((prev) => prev + 1);
        }
      }
    } else {
      if (currentVote === "down") {
        setCurrentVote(null);
        setOptimisticUpvoteCount((prev) => prev + 1); // Remove downvote effect
      } else {
        setCurrentVote("down");
        if (currentVote === "up") {
          setOptimisticUpvoteCount((prev) => prev - 2); // -1 to remove upvote, -1 to add downvote
        } else {
          setOptimisticUpvoteCount((prev) => prev - 1); // Just add downvote effect
        }
      }
    }

    // Execute database operation in background (non-blocking)
    const performDatabaseUpdate = async () => {
      try {
        if (voteType === "up") {
          await upvoteAnswer(answerId, user.uid, pathname);
        } else {
          await downvoteAnswer(answerId, user.uid, pathname);
        }
      } catch (error) {
        console.error("Error voting:", error);
        // Rollback optimistic update on error
        setCurrentVote(previousVote);
        setOptimisticUpvoteCount(previousUpvoteCount);
        toast({
          title: "Error",
          description: "Failed to register your vote. Please try again.",
          variant: "destructive",
        });
      }
    };

    // Start background update without blocking UI
    performDatabaseUpdate();
  };

  const isVertical = layout === "vertical";

  return (
    <div
      className={`flex ${
        isVertical ? "flex-col" : "flex-row"
      } items-center gap-2`}
    >
      <form action={() => handleVote("up")}>
        <VoteButton
          type="up"
          isActive={currentVote === "up"}
          isLoading={false}
        />
      </form>

      <span
        className={`${
          isVertical ? "text-lg" : "text-sm"
        } font-bold text-foreground min-w-[1.5rem] text-center`}
      >
        {optimisticUpvoteCount}
      </span>

      <form action={() => handleVote("down")}>
        <VoteButton
          type="down"
          isActive={currentVote === "down"}
          isLoading={false}
        />
      </form>
    </div>
  );
}
