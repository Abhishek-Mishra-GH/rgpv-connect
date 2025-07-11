import { ProfileForm } from "@/components/profile-form";
import { ProfileFormSkeleton } from "@/components/profile-form-skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { UserProfile } from "@/types";
import { Suspense } from "react";

async function ProfileContent() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/profile`, { cache: 'no-store' });
  if (!res.ok) {
     return <p className="text-destructive p-8 text-center">Failed to load profile.</p>;
  }
  const userProfile: UserProfile = await res.json();

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <CardDescription>
          {userProfile.isProfileComplete
            ? "View and manage your profile details." 
            : "Please complete your profile to get started."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileForm userProfile={userProfile} />
      </CardContent>
    </Card>
  )
}

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Suspense fallback={<ProfileFormSkeleton />}>
        <ProfileContent />
      </Suspense>
    </div>
  )
}
