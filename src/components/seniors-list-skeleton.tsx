// src/components/seniors-list-skeleton.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function SeniorCardSkeleton() {
  return (
    <Card className="text-center">
      <CardHeader>
        <Skeleton className="mx-auto h-20 w-20 rounded-full" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-5 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
        <div className="mt-2 flex justify-center">
          <Skeleton className="h-6 w-2/3" />
        </div>
        <Skeleton className="h-9 w-full mt-4" />
      </CardContent>
    </Card>
  );
}

export function SeniorsListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <SeniorCardSkeleton />
      <SeniorCardSkeleton />
      <SeniorCardSkeleton />
      <SeniorCardSkeleton />
    </div>
  )
}
