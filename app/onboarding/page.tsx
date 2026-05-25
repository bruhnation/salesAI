"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { VoiceRecorder } from "@/components/VoiceRecorder";
import {
  buildProspectSessionHref,
  filterProspects,
} from "@/lib/prospects-data";
import {
  dailyGoalOptions,
  experienceOptions,
  goalOptions,
  industryOptions,
  saveUserProfile,
  type Industry,
  type UserProfile,
} from "@/lib/user-profile";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const promptChips = [
  "Who are you?",
  "What do you sell?",
  "Who's your ideal customer?",
  "What's your biggest objection?",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [draft, setDraft] = useState<Partial<UserProfile>>({});
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const name = draft.name?.trim() ?? "";
  const canContinueName = name.length >= 2;
  const canContinueGoals = selectedGoals.length > 0;

  const progress = useMemo(() => (step / 8) * 100, [step]);

  async function persist(patch: Partial<UserProfile>) {
    const next = await saveUserProfile(patch);
    setDraft(next);
    return next;
  }

  async function finishOnboarding() {
    const profile = await persist({
      goals: selectedGoals,
      onboarded: true,
    });

    const firstProspect = filterProspects(
      profile.industry as Industry,
      false
    )[0];

    if (firstProspect) {
      router.push(buildProspectSessionHref(firstProspect));
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background px-4 pb-8 pt-6 text-white">
      <div className="mx-auto mb-6 h-1 w-full max-w-md overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        {step === 1 && (
          <>
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <h1 className="text-4xl font-black tracking-tight">
                Let&apos;s hear your voice.
              </h1>
              <p className="mt-3 text-base text-muted">
                30 seconds and you&apos;re in.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full rounded-full bg-accent py-4 text-base font-bold text-zinc-950"
            >
              Get Started
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex-1">
              <h1 className="text-center text-3xl font-black">
                What should we call you?
              </h1>
              <input
                value={draft.name ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Your first name"
                className="mt-10 w-full border-b border-white/20 bg-transparent py-4 text-center text-3xl font-bold outline-none placeholder:text-zinc-600"
                autoFocus
              />
            </div>
            <button
              type="button"
              disabled={!canContinueName}
              onClick={() => {
                void persist({ name }).then(() => setStep(3));
              }}
              className="w-full rounded-full bg-accent py-4 text-base font-bold text-zinc-950 disabled:bg-zinc-800 disabled:text-zinc-500"
            >
              Continue
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-3xl font-black">What are you selling?</h1>
            <div className="mt-6 space-y-3">
              {industryOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    void persist({ industry: option.id }).then(() => setStep(4));
                  }}
                  className="flex w-full items-start gap-4 rounded-2xl border border-white/10 bg-card px-4 py-4 text-left transition hover:border-accent/40"
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span>
                    <span className="block text-base font-bold">{option.label}</span>
                    <span className="mt-1 block text-sm text-muted">
                      {option.subtitle}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h1 className="text-3xl font-black">
              How long have you been selling?
            </h1>
            <div className="mt-8 space-y-3">
              {experienceOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    void persist({ experience_level: option.id }).then(() =>
                      setStep(5)
                    );
                  }}
                  className="w-full rounded-full border border-white/10 bg-card px-5 py-4 text-left text-base font-semibold transition hover:border-accent/40"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h1 className="text-3xl font-black">Now tell us about you.</h1>
            <p className="mt-3 text-sm text-muted">
              Tap the mic and answer like you&apos;d introduce yourself on a call.
              30 sec or less.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {promptChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted"
                >
                  {chip}
                </span>
              ))}
            </div>
            <div className="my-10 flex flex-1 items-center justify-center">
              <VoiceRecorder
                onTranscript={(text) => {
                  setVoiceError(null);
                  void persist({ pitch_context: text }).then(() => setStep(6));
                }}
                onError={setVoiceError}
              />
            </div>
            {voiceError && (
              <p className="mb-4 text-center text-sm text-red-400">{voiceError}</p>
            )}
            <button
              type="button"
              onClick={() => setStep(6)}
              className="w-full rounded-full border border-white/15 py-4 text-sm font-semibold text-muted"
            >
              Skip for now
            </button>
          </>
        )}

        {step === 6 && (
          <>
            <h1 className="text-3xl font-black">
              What do you want to get better at?
            </h1>
            <p className="mt-2 text-sm text-muted">Pick all that apply</p>
            <div className="mt-8 space-y-3">
              {goalOptions.map((goal) => {
                const active = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() =>
                      setSelectedGoals((current) =>
                        active
                          ? current.filter((item) => item !== goal)
                          : [...current, goal]
                      )
                    }
                    className={`w-full rounded-full border px-5 py-4 text-left text-base font-semibold transition ${
                      active
                        ? "border-accent bg-accent/15 text-white"
                        : "border-white/10 bg-card text-zinc-300"
                    }`}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              disabled={!canContinueGoals}
              onClick={() => {
                void persist({ goals: selectedGoals }).then(() => setStep(7));
              }}
              className="mt-8 w-full rounded-full bg-accent py-4 text-base font-bold text-zinc-950 disabled:bg-zinc-800 disabled:text-zinc-500"
            >
              Continue
            </button>
          </>
        )}

        {step === 7 && (
          <>
            <h1 className="text-3xl font-black">Pick your daily goal</h1>
            <p className="mt-2 text-sm text-muted">
              Streaks unlock leaderboard rewards
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {dailyGoalOptions.map((goal) => {
                const active = (draft.daily_goal ?? 3) === goal;
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() =>
                      setDraft((current) => ({ ...current, daily_goal: goal }))
                    }
                    className={`rounded-full px-5 py-3 text-base font-bold transition ${
                      active
                        ? "bg-accent text-zinc-950"
                        : "border border-white/10 bg-card text-zinc-300"
                    }`}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
            <label className="mt-8 flex items-center justify-between rounded-2xl border border-white/10 bg-card px-4 py-4">
              <span className="text-sm font-semibold">
                Daily reminder notifications
              </span>
              <input
                type="checkbox"
                checked={draft.notifications_enabled ?? true}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    notifications_enabled: event.target.checked,
                  }))
                }
                className="h-5 w-5 accent-accent"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                void (async () => {
                  if (draft.notifications_enabled ?? true) {
                    if ("Notification" in window) {
                      await Notification.requestPermission();
                    }
                  }
                  await persist({
                    daily_goal: draft.daily_goal ?? 3,
                    notifications_enabled: draft.notifications_enabled ?? true,
                  });
                  setStep(8);
                })();
              }}
              className="mt-8 w-full rounded-full bg-accent py-4 text-base font-bold text-zinc-950"
            >
              Continue
            </button>
          </>
        )}

        {step === 8 && (
          <>
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <h1 className="text-4xl font-black">
                You&apos;re in, {name || "rep"}.
              </h1>
              <p className="mt-3 text-base text-muted">
                Let&apos;s run your first call.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void finishOnboarding()}
              className="w-full rounded-full bg-accent py-4 text-base font-bold text-zinc-950"
            >
              Start Call 1 of 3 →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
