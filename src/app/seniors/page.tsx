import { SeniorCard } from "@/components/senior-card";
import { SeniorsListSkeleton } from "@/components/seniors-list-skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { UserProfile } from "@/types";
import { Suspense } from "react";
import { getSeniors } from "@/lib/firestore-actions";

async function SeniorsList() {
  const seniors: UserProfile[] = await getSeniors();
  
  if (seniors.length === 0) {
    return <p className="text-muted-foreground p-8 text-center">No seniors found.</p>;
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {seniors.map(senior => (
        <SeniorCard key={senior.id} senior={senior} />
      ))}
    </div>
  );
}

export default function SeniorsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect with Seniors</CardTitle>
        <CardDescription>
          Browse profiles of senior students and alumni for guidance and mentorship.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<SeniorsListSkeleton />}>
          <SeniorsList />
        </Suspense>
      </CardContent>
    </Card>
  )
}
