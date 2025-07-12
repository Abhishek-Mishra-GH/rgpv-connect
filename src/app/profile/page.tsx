'use client';

import { ProfileForm } from "@/components/profile-form";
import { ProfileFormSkeleton } from "@/components/profile-form-skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Logged out successfully.' });
      router.push('/login');
    } catch (error) {
      toast({ title: 'Logout failed', variant: 'destructive' });
    }
  };


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
          <div className="flex justify-between items-center">
            <CardTitle>My Profile</CardTitle>
            <Button onClick={handleLogout} variant="destructive" size="sm" className="md:hidden border border-destructive bg-transparent text-destructive hover:bg-destructive/10 h-8 px-2 text-xs">
                <LogOut className="mr-1.5 h-3 w-3"/>
                Logout
            </Button>
          </div>
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
