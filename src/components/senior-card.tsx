import type { UserProfile } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "./ui/button";

type SeniorCardProps = {
  senior: UserProfile;
}

export function SeniorCard({ senior }: SeniorCardProps) {
  return (
    <Card className="text-center hover:shadow-lg transition-shadow">
      <CardHeader>
        <Avatar className="mx-auto h-20 w-20 border-2 border-primary">
          <AvatarImage src={senior.avatarUrl} alt={senior.name} data-ai-hint="student portrait" />
          <AvatarFallback>{senior.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-headline font-semibold">{senior.name}</h3>
        <p className="text-sm text-muted-foreground">{senior.branch}</p>
        <div className="mt-2">
          <Badge variant="outline">
            {senior.course} &bull; Passout {senior.year}
          </Badge>
        </div>
        <Button size="sm" className="mt-4 w-full">View Profile</Button>
      </CardContent>
    </Card>
  )
}
