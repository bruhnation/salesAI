"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const scenarios = [
  {
    id: "skeptical-vc",
    title: "The Skeptical VC",
    character: "Michael Chen",
    description:
      "Defend your Series A metrics against a partner who's seen 200 decks this quarter.",
    difficulty: "Hard",
    duration: "15 min",
    gradient: "from-amber-500 to-orange-600",
    initial: "M",
  },
  {
    id: "technical-dd",
    title: "Technical Due Diligence",
    character: "Sarah Park",
    description:
      "Walk a technical LP through your product architecture and engineering moat.",
    difficulty: "Medium",
    duration: "12 min",
    gradient: "from-cyan-500 to-blue-600",
    initial: "S",
  },
  {
    id: "term-sheet",
    title: "Term Sheet Negotiation",
    character: "David Russo",
    description:
      "Navigate valuation, liquidation preferences, and board seats with a lead investor.",
    difficulty: "Expert",
    duration: "20 min",
    gradient: "from-rose-500 to-pink-600",
    initial: "D",
  },
];

const difficultyColor: Record<string, string> = {
  Medium: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  Hard: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Expert: "text-rose-400 bg-rose-400/10 border-rose-400/20",
};

export default function Dashboard() {
  const router = useRouter();
  const [customScenario, setCustomScenario] = useState("");

  return (
    <div className="flex min-h-dvh flex-col pb-20">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/[0.05] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-2xl px-4 pt-8 pb-6 sm:px-6">
        {/* Top bar */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-accent to-purple-500 text-sm font-bold text-white shadow-lg shadow-accent/20">
              D
            </div>
            <div>
              <h1 className="text-base font-semibold text-white">
                Welcome back, Diego
              </h1>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                  Founder / Fundraising
                </span>
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="flex flex-col items-center rounded-xl border border-border/50 bg-card/50 px-4 py-2">
            <div className="flex items-center gap-1">
              <svg
                className="h-4 w-4 text-amber-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2c.5 0 1 .19 1.41.59l3 3c.37.37.59.88.59 1.41v4c0 1.1-.9 2-2 2h-1v2h1c1.1 0 2 .9 2 2v4c0 .53-.21 1.04-.59 1.41l-3 3c-.78.78-2.05.78-2.83 0l-3-3A1.99 1.99 0 017 21v-4c0-1.1.9-2 2-2h1v-2H9c-1.1 0-2-.9-2-2V7c0-.53.21-1.04.59-1.41l3-3C10.99 2.19 11.5 2 12 2z" />
              </svg>
              <span className="text-lg font-bold text-white">7</span>
            </div>
            <span className="text-[10px] font-medium text-muted">
              day streak
            </span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mb-8 grid grid-cols-3 gap-3">
          {[
            { label: "Sessions", value: "12", icon: "chat" },
            { label: "Avg. Score", value: "8.4", icon: "star" },
            { label: "Hours", value: "3.2", icon: "clock" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border/40 bg-card/40 px-3 py-3 text-center"
            >
              <div className="text-lg font-bold text-white">{stat.value}</div>
              <div className="text-[10px] font-medium text-muted">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Section: Personalized Scenarios */}
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="text-xs font-medium tracking-wider text-muted/70 uppercase">
            Your Personalized Scenarios
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        <p className="mb-5 text-center text-xs text-muted/50">
          Tailored to your Founder / Fundraising role
        </p>

        {/* Scenario cards */}
        <div className="mb-10 space-y-3">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => router.push("/session")}
              className="group flex w-full items-start gap-4 rounded-xl border border-border/50 bg-card/50 p-4 text-left transition-all duration-200 hover:border-border hover:bg-card"
            >
              {/* Avatar */}
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${s.gradient} text-sm font-bold text-white shadow-lg`}
              >
                {s.initial}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                    {s.title}
                  </span>
                  <span
                    className={`rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${difficultyColor[s.difficulty]}`}
                  >
                    {s.difficulty}
                  </span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">
                  with {s.character} · {s.duration}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted/70">
                  {s.description}
                </p>
              </div>

              {/* Arrow */}
              <svg
                className="mt-1 h-4 w-4 shrink-0 text-muted/30 transition-colors group-hover:text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          ))}
        </div>

        {/* Section: Custom Scenario */}
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="text-xs font-medium tracking-wider text-muted/70 uppercase">
            Practice Custom Scenario
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        <p className="mb-5 text-center text-xs text-muted/50">
          Describe any situation and we&apos;ll build it for you
        </p>

        <div className="rounded-xl border border-border/50 bg-card/50 transition-colors focus-within:border-accent/40 focus-within:bg-card">
          <textarea
            value={customScenario}
            onChange={(e) => setCustomScenario(e.target.value)}
            placeholder='e.g. "A board member is questioning our burn rate and asking why we need the bridge round..."'
            rows={3}
            className="w-full resize-none rounded-xl bg-transparent px-4 pt-4 pb-12 text-sm leading-relaxed text-white placeholder:text-muted/40 focus:outline-none"
          />
          <div className="flex items-center justify-between px-3 pb-3">
            <span className="text-[10px] text-muted/30">
              {customScenario.length > 0 && `${customScenario.length} chars`}
            </span>
            <button
              disabled={customScenario.trim().length === 0}
              onClick={() => router.push("/session")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                customScenario.trim().length > 0
                  ? "bg-accent text-white shadow-[0_0_20px_-4px_rgba(167,139,250,0.45)] hover:brightness-110"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              }`}
            >
              Start
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed right-0 bottom-0 left-0 z-30 border-t border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-around px-2 py-2">
          {[
            {
              id: "home",
              label: "Home",
              active: true,
              icon: (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
              ),
            },
            {
              id: "roleplays",
              label: "Roleplays",
              active: false,
              icon: (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                  />
                </svg>
              ),
            },
            {
              id: "progress",
              label: "Progress",
              active: false,
              icon: (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                  />
                </svg>
              ),
            },
            {
              id: "settings",
              label: "Settings",
              active: false,
              icon: (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              ),
            },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition-colors ${
                tab.active
                  ? "text-accent"
                  : "text-muted/50 hover:text-muted"
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-medium">{tab.label}</span>
              {tab.active && (
                <div className="h-0.5 w-4 rounded-full bg-accent" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
