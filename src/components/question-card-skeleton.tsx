// src/components/question-card-skeleton.tsx
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function QuestionCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1">
          <Skeleton className="h-6 w-10 rounded-md" />
        </div>
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-5 w-24 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
