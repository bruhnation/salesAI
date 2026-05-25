"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AppBottomNav } from "@/components/AppBottomNav";
import { StreakBadge } from "@/components/StreakBadge";
import {
  FREE_CALLS_PER_DAY,
  getFreeCallsRemaining,
  getUserProfile,
  industryOptions,
  saveUserProfile,
  type UserProfile,
} from "@/lib/user-profile";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void getUserProfile().then((next) => {
      if (!next.onboarded) {
        router.replace("/onboarding");
        return;
      }
      setProfile(next);
    });
  }, [router]);

  async function update(patch: Partial<UserProfile>) {
    setSaving(true);
    try {
      const next = await saveUserProfile(patch);
      setProfile(next);
    } finally {
      setSaving(false);
    }
  }

  if (!profile) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  const industryLabel =
    industryOptions.find((option) => option.id === profile.industry)?.label ??
    "Not set";
  const freeLeft = getFreeCallsRemaining(profile);

  return (
    <div className="min-h-dvh bg-background pb-28 text-white">
      <main className="mx-auto max-w-md px-4 pt-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Profile</h1>
            <p className="text-sm text-muted">{profile.name || "Sales rep"}</p>
          </div>
          <StreakBadge />
        </header>

        <section className="mb-6 rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
            Plan
          </p>
          <p className="mt-2 text-lg font-black capitalize">
            {profile.subscription_tier}
          </p>
          {profile.subscription_tier === "free" && (
            <p className="mt-1 text-sm text-muted">
              {freeLeft} of {FREE_CALLS_PER_DAY} free calls left today
            </p>
          )}
          {profile.subscription_tier === "free" && (
            <button
              type="button"
              className="mt-4 w-full rounded-full bg-accent py-3 text-sm font-bold text-zinc-950"
            >
              Upgrade to Premium
            </button>
          )}
        </section>

        <section className="space-y-3">
          <article className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
              Industry
            </p>
            <p className="mt-2 font-semibold">{industryLabel}</p>
          </article>

          <label className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-4">
            <div>
              <p className="font-semibold">Show all industries</p>
              <p className="mt-1 text-xs text-muted">
                Include scenarios outside your industry on Home
              </p>
            </div>
            <input
              type="checkbox"
              checked={profile.show_all_industries}
              disabled={saving}
              onChange={(event) =>
                void update({ show_all_industries: event.target.checked })
              }
              className="h-5 w-5 accent-accent"
            />
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-4">
            <div>
              <p className="font-semibold">Daily reminders</p>
              <p className="mt-1 text-xs text-muted">Push at 6pm local time</p>
            </div>
            <input
              type="checkbox"
              checked={profile.notifications_enabled}
              disabled={saving}
              onChange={(event) =>
                void (async () => {
                  if (event.target.checked && "Notification" in window) {
                    await Notification.requestPermission();
                  }
                  await update({ notifications_enabled: event.target.checked });
                })()
              }
              className="h-5 w-5 accent-accent"
            />
          </label>

          {profile.pitch_context && (
            <article className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                Your pitch
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                {profile.pitch_context}
              </p>
            </article>
          )}
        </section>
      </main>

      <AppBottomNav />
    </div>
  );
}
