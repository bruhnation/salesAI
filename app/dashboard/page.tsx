"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AppBottomNav } from "@/components/AppBottomNav";
import { StreakBadge } from "@/components/StreakBadge";
import {
  buildProspectSessionHref,
  filterProspects,
  industryLabel,
} from "@/lib/prospects-data";
import { scheduleDailyReminder } from "@/lib/daily-notifications";
import {
  FREE_CALLS_PER_DAY,
  getFreeCallsRemaining,
  getUserProfile,
  type UserProfile,
} from "@/lib/user-profile";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    void getUserProfile().then((next) => {
      if (!next.onboarded) {
        router.replace("/onboarding");
        return;
      }
      setProfile(next);
      scheduleDailyReminder(
        next.notifications_enabled,
        next.current_streak
      );
    });
  }, [router]);

  if (!profile) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  const prospects = filterProspects(profile.industry, profile.show_all_industries);
  const freeLeft = getFreeCallsRemaining(profile);
  const freeLabel =
    profile.subscription_tier === "premium"
      ? "Unlimited calls"
      : `${freeLeft} of ${FREE_CALLS_PER_DAY} free calls left today`;

  return (
    <div className="min-h-dvh bg-background pb-28 text-white">
      <main className="mx-auto max-w-md px-4 pt-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">Welcome back</p>
            <h1 className="text-2xl font-black">{profile.name || "Rep"}</h1>
          </div>
          <StreakBadge />
        </header>

        <section className="mb-6 rounded-2xl border border-accent/25 bg-accent/10 p-4">
          <p className="text-sm font-bold text-accent">{freeLabel}</p>
          <p className="mt-1 text-xs text-muted">
            {profile.industry
              ? `${industryLabel(profile.industry)} scenarios for you`
              : "Personalized scenarios"}
          </p>
          <p className="mt-3 text-xs text-muted">
            Daily goal: {profile.calls_completed_today}/{profile.daily_goal} calls
          </p>
        </section>

        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-[0.22em] text-muted">
              Train
            </h2>
          </div>
          <div className="space-y-3">
            {prospects.slice(0, 4).map((prospect) => (
              <Link
                key={prospect.id}
                href={buildProspectSessionHref(prospect)}
                className="block overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div
                  className={`relative h-40 bg-gradient-to-br ${prospect.imageClass} p-4`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="relative">
                    <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black text-zinc-900">
                      {industryLabel(prospect.industry)}
                    </span>
                    <h3 className="mt-3 text-xl font-black">
                      {prospect.name}, {prospect.age}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-200">{prospect.situation}</p>
                    <p className="mt-2 text-sm font-semibold text-accent">
                      &quot;{prospect.objection}&quot;
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {freeLeft === 0 && profile.subscription_tier === "free" && (
          <section className="rounded-2xl border border-accent/30 bg-card p-5 text-center">
            <h2 className="text-lg font-black">Daily limit reached</h2>
            <p className="mt-2 text-sm text-muted">
              Upgrade for unlimited calls, advanced scenarios, and leaderboard prizes.
            </p>
            <button
              type="button"
              className="mt-4 w-full rounded-full bg-accent py-3 text-sm font-bold text-zinc-950"
            >
              Upgrade to Premium
            </button>
          </section>
        )}
      </main>

      <AppBottomNav />
    </div>
  );
}
