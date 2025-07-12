"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Home, PlusCircle, User, LogIn, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Logo } from "./logo";
import { useAuth } from "./auth-provider";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/ask-question", icon: PlusCircle, label: "Ask a Question" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function MainSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [loadingPath, setLoadingPath] = useState<string | null>(null);

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    if (href === pathname) return;

    setLoadingPath(href);
    // Let the navigation happen naturally, the NavigationLoader will handle completion
    setTimeout(() => setLoadingPath(null), 100);
  };

  return (
    <div className="hidden border-r bg-card md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Logo />
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => {
              if (
                !user &&
                (item.href === "/profile" || item.href === "/ask-question")
              ) {
                return null;
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(item.href, e)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    {
                      "bg-muted text-primary": pathname === item.href,
                    }
                  )}
                >
                  {loadingPath === item.href ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <item.icon className="h-4 w-4" />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Card>
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>{user ? "Need Help?" : "Get Involved"}</CardTitle>
              <CardDescription>
                {user
                  ? "Stuck on a problem? Ask the community and get help from seniors."
                  : "Sign up to ask questions, post answers, and connect with peers."}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              {user ? (
                <Button size="sm" className="w-full" asChild>
                  <Link
                    href="/ask-question"
                    onClick={(e) => handleNavClick("/ask-question", e)}
                  >
                    {loadingPath === "/ask-question" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Ask Now
                  </Link>
                </Button>
              ) : (
                <Button size="sm" className="w-full" asChild>
                  <Link
                    href="/login"
                    onClick={(e) => handleNavClick("/login", e)}
                  >
                    {loadingPath === "/login" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LogIn className="mr-2 h-4 w-4" />
                    )}
                    Login to Participate
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
