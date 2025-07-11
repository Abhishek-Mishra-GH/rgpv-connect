import { SeniorCard } from "@/components/senior-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { dummySeniors } from "@/lib/data";

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {dummySeniors.map(senior => (
            <SeniorCard key={senior.id} senior={senior} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
