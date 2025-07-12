// src/components/auth-provider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { UserProfile } from '@/types';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { ProfileForm } from './profile-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Logo } from './logo';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

// Allow anonymous users to browse these pages
const publicRoutes = ['/login', '/', '/seniors'];
const isPublicRoute = (pathname: string) => {
    if (publicRoutes.includes(pathname)) return true;
    if (pathname.startsWith('/question/')) return true;
    return false;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileCompletionModalOpen, setIsProfileCompletionModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const profile = userSnap.data() as UserProfile;
          setUserProfile(profile);
          if (!profile.isProfileComplete) {
            setIsProfileCompletionModalOpen(true);
          } else {
            setIsProfileCompletionModalOpen(false);
          }
        } else {
           // Should be handled by user-auth-form, but as a fallback
           setIsProfileCompletionModalOpen(true);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setIsProfileCompletionModalOpen(false);
        if (!isPublicRoute(pathname)) {
          router.push('/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleProfileUpdated = () => {
    setIsProfileCompletionModalOpen(false);
    router.refresh(); // Refresh to get latest server state
  }

  return (
    <AuthContext.Provider value={{ user, userProfile, loading }}>
        {children}
        <Dialog open={isProfileCompletionModalOpen}>
            <DialogContent className="sm:max-w-[425px]" hideCloseButton>
                <DialogHeader>
                    <div className="flex justify-center mb-4">
                       <Logo />
                    </div>
                    <DialogTitle className="text-center text-2xl">Complete Your Profile</DialogTitle>
                    <DialogDescription className="text-center">
                        Welcome! Please fill out your profile details to continue.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-4">
                  {userProfile && <ProfileForm userProfile={userProfile} onUpdate={handleProfileUpdated} />}
                </div>
            </DialogContent>
        </Dialog>
    </AuthContext.Provider>
  );
};
