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
  upvoteCount,
  downvoteCount,
  layout = "vertical",
}: QuestionVotingProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const { toast } = useToast();
  const [currentVote, setCurrentVote] = useState<"up" | "down" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      getUserQuestionVote(questionId, user.uid).then(setCurrentVote);
    } else {
      setCurrentVote(null);
    }
  }, [questionId, user?.uid]);

  const handleVote = async (voteType: "up" | "down") => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote on questions.",
        variant: "destructive",
      });
      return;
    }

    // Store the previous vote for rollback in case of error
    const previousVote = currentVote;
    setIsLoading(true);

    try {
      if (voteType === "up") {
        // Optimistically update the UI first
        if (currentVote === "up") {
          setCurrentVote(null); // Remove upvote
        } else {
          setCurrentVote("up"); // Add upvote (or switch from downvote)
        }
        await upvoteQuestion(questionId, user.uid, pathname);
      } else {
        // Optimistically update the UI first
        if (currentVote === "down") {
          setCurrentVote(null); // Remove downvote
        } else {
          setCurrentVote("down"); // Add downvote (or switch from upvote)
        }
        await downvoteQuestion(questionId, user.uid, pathname);
      }
    } catch (error) {
      console.error("Error voting:", error);
      // Rollback optimistic update on error
      setCurrentVote(previousVote);
      toast({
        title: "Error",
        description: "Failed to register your vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <form action={() => handleVote("up")}>
        <VoteButton
          type="up"
          isActive={currentVote === "up"}
          isLoading={isLoading}
        />
      </form>
      {upvoteCount !== undefined && (
        <span className="text-xl font-bold text-foreground">{upvoteCount}</span>
      )}
      <form action={() => handleVote("down")}>
        <VoteButton
          type="down"
          isActive={currentVote === "down"}
          isLoading={isLoading}
        />
      </form>
    </div>
  );
}

interface AnswerVotingProps {
  answerId: string;
  upvoteCount?: number;
  downvoteCount?: number;
}

export function AnswerVoting({
  answerId,
  upvoteCount,
  downvoteCount,
}: AnswerVotingProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const { toast } = useToast();
  const [currentVote, setCurrentVote] = useState<"up" | "down" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      getUserAnswerVote(answerId, user.uid).then(setCurrentVote);
    } else {
      setCurrentVote(null);
    }
  }, [answerId, user?.uid]);

  const handleVote = async (voteType: "up" | "down") => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote on answers.",
        variant: "destructive",
      });
      return;
    }

    // Store the previous vote for rollback in case of error
    const previousVote = currentVote;
    setIsLoading(true);

    try {
      if (voteType === "up") {
        // Optimistically update the UI first
        if (currentVote === "up") {
          setCurrentVote(null); // Remove upvote
        } else {
          setCurrentVote("up"); // Add upvote (or switch from downvote)
        }
        await upvoteAnswer(answerId, user.uid, pathname);
      } else {
        // Optimistically update the UI first
        if (currentVote === "down") {
          setCurrentVote(null); // Remove downvote
        } else {
          setCurrentVote("down"); // Add downvote (or switch from upvote)
        }
        await downvoteAnswer(answerId, user.uid, pathname);
      }
    } catch (error) {
      console.error("Error voting:", error);
      // Rollback optimistic update on error
      setCurrentVote(previousVote);
      toast({
        title: "Error",
        description: "Failed to register your vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <form action={() => handleVote("up")}>
        <VoteButton
          type="up"
          isActive={currentVote === "up"}
          isLoading={isLoading}
        />
      </form>
      {upvoteCount !== undefined && (
        <span className="text-xl font-bold text-foreground">{upvoteCount}</span>
      )}
      <form action={() => handleVote("down")}>
        <VoteButton
          type="down"
          isActive={currentVote === "down"}
          isLoading={isLoading}
        />
      </form>
    </div>
  );
}
