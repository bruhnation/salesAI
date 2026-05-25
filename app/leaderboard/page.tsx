"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AppBottomNav } from "@/components/AppBottomNav";
import { StreakBadge } from "@/components/StreakBadge";
import { industryLabel } from "@/lib/prospects-data";
import { getUserProfile, type Industry, type UserProfile } from "@/lib/user-profile";

type LeaderboardFilter =
  | "industry"
  | "vancouver"
  | "bc"
  | "canada"
  | "global";

const seedBoard = [
  { name: "Alex R.", calls: 42, streak: 12 },
  { name: "Jordan M.", calls: 38, streak: 9 },
  { name: "Sam K.", calls: 35, streak: 8 },
  { name: "Taylor P.", calls: 31, streak: 7 },
  { name: "Casey L.", calls: 28, streak: 6 },
  { name: "Riley D.", calls: 24, streak: 5 },
  { name: "Morgan S.", calls: 21, streak: 4 },
  { name: "Jamie W.", calls: 18, streak: 3 },
  { name: "Drew H.", calls: 15, streak: 2 },
  { name: "Avery T.", calls: 12, streak: 1 },
];

const filters: Array<{ id: LeaderboardFilter; label: string }> = [
  { id: "industry", label: "My Industry" },
  { id: "vancouver", label: "Vancouver" },
  { id: "bc", label: "BC" },
  { id: "canada", label: "Canada" },
  { id: "global", label: "Global" },
];

export default function LeaderboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [filter, setFilter] = useState<LeaderboardFilter>("industry");

  useEffect(() => {
    void getUserProfile().then((next) => {
      if (!next.onboarded) {
        router.replace("/onboarding");
        return;
      }
      setProfile(next);
    });
  }, [router]);

  const userRank = useMemo(() => {
    if (!profile) return null;
    const userCalls = profile.calls_completed_today + profile.current_streak * 3;
    const rank =
      seedBoard.findIndex((entry) => entry.calls <= userCalls) + 1 || 11;
    return {
      rank,
      calls: userCalls,
      streak: profile.current_streak,
    };
  }, [profile]);

  if (!profile) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background pb-28 text-white">
      <main className="mx-auto max-w-md px-4 pt-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Leaderboard</h1>
            <p className="text-sm text-muted">Resets every Monday</p>
          </div>
          <StreakBadge />
        </header>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${
                filter === item.id
                  ? "bg-accent text-zinc-950"
                  : "border border-border bg-card text-muted"
              }`}
            >
              {item.id === "industry"
                ? industryLabel(profile.industry as Industry)
                : item.label}
            </button>
          ))}
        </div>

        <section className="space-y-2">
          {seedBoard.map((entry, index) => (
            <article
              key={entry.name}
              className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-sm font-black text-accent">
                  #{index + 1}
                </span>
                <div>
                  <p className="font-bold">{entry.name}</p>
                  <p className="text-xs text-muted">{entry.calls} calls this week</p>
                </div>
              </div>
              <span className="text-sm font-bold">🔥 {entry.streak}</span>
            </article>
          ))}
        </section>

        {userRank && (
          <section className="mt-6 rounded-2xl border border-accent/30 bg-accent/10 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
              Your position
            </p>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="font-black">{profile.name || "You"}</p>
                <p className="text-sm text-muted">Rank #{userRank.rank}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{userRank.calls} calls</p>
                <p className="text-sm text-muted">🔥 {userRank.streak}</p>
              </div>
            </div>
          </section>
        )}
      </main>

      <AppBottomNav />
    </div>
  );
}
