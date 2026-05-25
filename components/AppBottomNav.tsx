"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, Home, Trophy, User } from "lucide-react";

const tabs = [
  {
    href: "/dashboard",
    label: "Home",
    Icon: Home,
    match: (path: string) => path === "/dashboard" || path === "/",
  },
  {
    href: "/leaderboard",
    label: "Leaderboard",
    Icon: Trophy,
    match: (path: string) => path.startsWith("/leaderboard"),
  },
  {
    href: "/calls",
    label: "Calls",
    Icon: History,
    match: (path: string) => path.startsWith("/calls"),
  },
  {
    href: "/profile",
    label: "Profile",
    Icon: User,
    match: (path: string) => path.startsWith("/profile"),
  },
];

export function AppBottomNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {tabs.map(({ href, label, Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl py-2 transition ${
                active ? "text-accent" : "text-muted hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
