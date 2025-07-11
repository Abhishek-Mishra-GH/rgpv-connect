import { ProfileForm } from "@/components/profile-form";
import { ProfileFormSkeleton } from "@/components/profile-form-skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Suspense } from "react";

async function ProfileContent() {
  // Simulate fetching user data
  await new Promise(resolve => setTimeout(resolve, 1000));
  // This logic would be based on the actual user's state
  const isProfileComplete = false; 

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <CardDescription>
          {isProfileComplete 
            ? "View and manage your profile details." 
            : "Please complete your profile to get started."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* For now, we always show the form.
            In a real app, you would fetch user data and conditionally render
            either the form or the profile view. */}
        <ProfileForm />
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
