"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AppBottomNav } from "@/components/AppBottomNav";
import { StreakBadge } from "@/components/StreakBadge";
import { getRecentSessions } from "@/lib/firebase";
import { buildProspectSessionHref, filterProspects } from "@/lib/prospects-data";
import type { SessionRecord } from "@/lib/sales-app-data";
import { getUserProfile, type UserProfile } from "@/lib/user-profile";

function formatWhen(completedAtMs: number) {
  const deltaDays = Math.floor((Date.now() - completedAtMs) / 86_400_000);
  if (deltaDays <= 0) return "Today";
  if (deltaDays === 1) return "Yesterday";
  return `${deltaDays} days ago`;
}

export default function CallsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);

  useEffect(() => {
    void Promise.all([getUserProfile(), getRecentSessions(20)]).then(
      ([nextProfile, nextSessions]) => {
        if (!nextProfile.onboarded) {
          router.replace("/onboarding");
          return;
        }
        setProfile(nextProfile);
        setSessions(nextSessions);
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

  const firstProspect = filterProspects(profile.industry, profile.show_all_industries)[0];

  return (
    <div className="min-h-dvh bg-background pb-28 text-white">
      <main className="mx-auto max-w-md px-4 pt-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Calls History</h1>
            <p className="text-sm text-muted">Your completed roleplays</p>
          </div>
          <StreakBadge />
        </header>

        {sessions.length > 0 ? (
          <section className="space-y-3">
            {sessions.map((session) => (
              <article
                key={session.id}
                className="rounded-2xl border border-border bg-card p-4"
              >
                <p className="font-bold">{session.scenario}</p>
                <p className="mt-1 text-sm text-muted">with {session.character}</p>
                <p className="mt-2 text-xs text-muted">
                  {formatWhen(session.completedAtMs)} · +{session.xpAwarded} XP
                </p>
              </article>
            ))}
          </section>
        ) : (
          <section className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 px-6 text-center">
            <h2 className="text-xl font-black">No calls yet</h2>
            <p className="mt-2 text-sm text-muted">
              Run your first call and start your streak.
            </p>
            {firstProspect && (
              <Link
                href={buildProspectSessionHref(firstProspect)}
                className="mt-6 w-full rounded-full bg-accent py-3 text-sm font-bold text-zinc-950"
              >
                Run your first call and start your streak →
              </Link>
            )}
          </section>
        )}
      </main>

      <AppBottomNav />
    </div>
  );
}
