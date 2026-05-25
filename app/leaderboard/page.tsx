"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AppBottomNav } from "@/components/AppBottomNav";
import { StreakBadge } from "@/components/StreakBadge";
import { industryLabel } from "@/lib/prospects-data";
import {
  getCurrentMilestone,
  getNextMilestone,
  getWeekResetLabel,
  getWeeklyCallCount,
  weeklyMilestones,
} from "@/lib/weekly-stats";
import { getUserProfile, type Industry, type UserProfile } from "@/lib/user-profile";

type LeagueFilter = "industry" | "vancouver" | "bc" | "canada" | "global";

const filters: Array<{ id: LeagueFilter; label: string }> = [
  { id: "industry", label: "My Industry" },
  { id: "vancouver", label: "Vancouver" },
  { id: "bc", label: "BC" },
  { id: "canada", label: "Canada" },
  { id: "global", label: "Global" },
];

export default function LeaderboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [weeklyCalls, setWeeklyCalls] = useState(0);
  const [filter, setFilter] = useState<LeagueFilter>("industry");

  useEffect(() => {
    void Promise.all([getUserProfile(), getWeeklyCallCount()]).then(
      ([nextProfile, calls]) => {
        if (!nextProfile.onboarded) {
          router.replace("/onboarding");
          return;
        }
        setProfile(nextProfile);
        setWeeklyCalls(calls);
      }
    );
  }, [router]);

  if (!profile) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  const currentMilestone = getCurrentMilestone(weeklyCalls);
  const nextMilestone = getNextMilestone(weeklyCalls);
  const leagueName =
    filter === "industry"
      ? industryLabel(profile.industry as Industry)
      : filters.find((item) => item.id === filter)?.label ?? "Global";

  return (
    <div className="min-h-dvh bg-background pb-28 text-white">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-48 glow-copper" />

      <main className="relative mx-auto max-w-md px-4 pt-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Your league</h1>
            <p className="text-sm text-muted">{getWeekResetLabel()} · Monday reset</p>
          </div>
          <StreakBadge />
        </header>

        <section className="mb-6 rounded-2xl border border-accent/25 bg-card p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">
            This week · {leagueName}
          </p>
          <p className="mt-2 text-4xl font-black tabular-nums">{weeklyCalls}</p>
          <p className="text-sm text-muted">calls completed</p>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-background/60 px-3 py-2">
            <span className="text-sm font-semibold">{currentMilestone.tier}</span>
            <span className="text-xs text-muted">{profile.name || "You"}</span>
          </div>
        </section>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
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

        <p className="mb-4 rounded-xl border border-border/80 bg-card/50 px-3 py-2.5 text-xs leading-relaxed text-muted">
          Live rankings against other reps launch when we connect your league.
          Until then, hit weekly milestones below — your stats are real.
        </p>

        <section className="space-y-2">
          <h2 className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-muted">
            Weekly milestones
          </h2>
          {weeklyMilestones.map((milestone) => {
            const reached = weeklyCalls >= milestone.calls;
            return (
              <article
                key={milestone.id}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
                  reached
                    ? "border-streak/30 bg-streak-soft"
                    : "border-border bg-card"
                }`}
              >
                <div>
                  <p
                    className={`font-bold ${reached ? "text-streak" : "text-white"}`}
                  >
                    {milestone.tier}
                  </p>
                  <p className="text-xs text-muted">{milestone.description}</p>
                </div>
                <span
                  className={`text-sm font-black tabular-nums ${
                    reached ? "text-streak" : "text-muted"
                  }`}
                >
                  {reached ? "✓" : milestone.calls}
                </span>
              </article>
            );
          })}
        </section>

        {nextMilestone && (
          <section className="mt-6 rounded-2xl border border-accent/30 bg-accent/10 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
              Next up
            </p>
            <p className="mt-2 font-black">{nextMilestone.tier}</p>
            <p className="mt-1 text-sm text-muted">
              {nextMilestone.calls - weeklyCalls} more call
              {nextMilestone.calls - weeklyCalls === 1 ? "" : "s"} this week
            </p>
            <Link
              href="/dashboard"
              className="mt-4 block w-full rounded-full bg-accent py-3 text-center text-sm font-bold text-zinc-950"
            >
              Run a call →
            </Link>
          </section>
        )}

        {weeklyCalls === 0 && (
          <section className="mt-6 rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center">
            <h2 className="text-lg font-black">No calls this week yet</h2>
            <p className="mt-2 text-sm text-muted">
              Complete one call to land on the board in your {leagueName} league.
            </p>
            <Link
              href="/dashboard"
              className="mt-4 block w-full rounded-full bg-accent py-3 text-sm font-bold text-zinc-950"
            >
              Start your first call →
            </Link>
          </section>
        )}
      </main>

      <AppBottomNav />
    </div>
  );
}
