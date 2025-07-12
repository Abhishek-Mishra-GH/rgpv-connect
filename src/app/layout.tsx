import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/header";
import { MainSidebar } from "@/components/main-sidebar";
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { Suspense } from 'react';
import { NavigationLoader } from '@/components/navigation-loader';
import { AuthProvider } from '@/components/auth-provider';

export const metadata: Metadata = {
  title: 'RGPV Connect',
  description: 'A community app for RGPV students to ask doubts and get guidance from seniors.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Suspense>
          <NavigationLoader />
        </Suspense>
        <AuthProvider>
          <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <MainSidebar />
            <div className="flex flex-col">
              <Header />
              <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background pb-24 md:pb-6">
                {children}
              </main>
            </div>
          </div>
          <MobileBottomNav />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
