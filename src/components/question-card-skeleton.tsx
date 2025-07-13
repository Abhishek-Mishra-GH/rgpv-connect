// src/components/question-card-skeleton.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function QuestionCardSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:gap-4">
          {/* Desktop vote buttons skeleton */}
          <div className="hidden sm:flex flex-col items-center gap-1 w-12 flex-shrink-0">
            <Skeleton className="h-6 w-10 rounded-md" />
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            {/* Title */}
            <Skeleton className="h-5 w-full max-w-[90%]" />

            {/* Author info */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 rounded-full flex-shrink-0" />
              <Skeleton className="h-4 w-32 max-w-[60%]" />
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>

            {/* Tags */}
            <div className="flex gap-1 sm:gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>

            {/* Mobile bottom bar */}
            <div className="sm:hidden flex items-center justify-between pt-3 border-t border-border/20">
              <Skeleton className="h-6 w-16" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>
            </div>

            {/* Desktop bottom bar */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
