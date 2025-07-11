// src/components/question-feed-skeleton.tsx
import { QuestionCardSkeleton } from "./question-card-skeleton"

export function QuestionFeedSkeleton() {
  return (
    <div className="space-y-4">
      <QuestionCardSkeleton />
      <QuestionCardSkeleton />
      <QuestionCardSkeleton />
    </div>
  )
}
