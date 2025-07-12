// src/components/mobile-bottom-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, PlusCircle, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/ask-question", icon: PlusCircle, label: "Ask" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [loadingPath, setLoadingPath] = useState<string | null>(null);

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    if (href === pathname) return;

    setLoadingPath(href);
    setTimeout(() => setLoadingPath(null), 100);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t z-50">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={(e) => handleNavClick(item.href, e)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-muted-foreground w-full h-full",
              {
                "text-primary": pathname === item.href,
              }
            )}
          >
            {loadingPath === item.href ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <item.icon className="h-6 w-6" />
            )}
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
