"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleUser, LogOut, LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "./logo";

export function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loadingPath, setLoadingPath] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
      toast({ title: "Logged out successfully." });
      router.push("/login");
    } catch (error) {
      toast({ title: "Logout failed", variant: "destructive" });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleNavClick = (href: string) => {
    setLoadingPath(href);
    setTimeout(() => setLoadingPath(null), 100);
  };

  return (
    <header className="flex h-14 items-center md:justify-end justify-between border-b bg-card px-4 lg:h-[60px] lg:px-6">
      {/* Logo and Brand Name */}
      <div className="flex items-center gap-2 md:hidden">
        <Logo />
      </div>

      {/* Desktop Navigation and User Menu */}
      <div className="flex items-center gap-6">
        {user && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => handleNavClick("/")}
            >
              Home
            </Link>
            <Link
              href="/ask-question"
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => handleNavClick("/ask-question")}
            >
              Ask Question
            </Link>
          </nav>
        )}

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/profile"
                  onClick={() => handleNavClick("/profile")}
                >
                  {loadingPath === "/profile" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="mr-2 h-4 w-4" />
                )}
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild size="sm">
            <Link href="/login" onClick={() => handleNavClick("/login")}>
              {loadingPath === "/login" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              Login
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
