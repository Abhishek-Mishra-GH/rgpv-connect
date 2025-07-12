'use client';

import { ProfileForm } from "@/components/profile-form";
import { ProfileFormSkeleton } from "@/components/profile-form-skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  // If user is not logged in, redirect them. This page is not public.
  if (!loading && !user) {
    router.push('/login');
    return <ProfileFormSkeleton />;
  }
  
  if (loading || !userProfile) {
    return <ProfileFormSkeleton />;
  }

  return (
    <div className="mx-auto max-w-2xl">
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
    </div>
  )
}
