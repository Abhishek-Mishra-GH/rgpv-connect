import { SeniorCard } from "@/components/senior-card";
import { SeniorsListSkeleton } from "@/components/seniors-list-skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { UserProfile } from "@/types";
import { Suspense } from "react";

async function SeniorsList() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/seniors`, { cache: 'no-store' });
  if (!res.ok) {
    return <p className="text-destructive p-8 text-center">Failed to load seniors list.</p>;
  }
  const seniors: UserProfile[] = await res.json();
  
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
