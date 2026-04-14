"use client";

import { useState } from "react";

const scenarios = [
  {
    id: "skeptical-vc",
    title: "The Skeptical VC",
    character: "Michael Chen",
    description:
      "Defend your Series A metrics against a partner who has seen hundreds of decks this quarter.",
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
      "Walk a technical LP through your product architecture and what makes it defensible.",
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
      "Navigate valuation, preferences, and board composition with a lead investor at the table.",
    difficulty: "Expert",
    duration: "20 min",
    gradient: "from-rose-500 to-pink-600",
    initial: "D",
  },
];

const difficultyStyles: Record<string, string> = {
  Medium: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  Hard: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Expert: "text-rose-400 bg-rose-400/10 border-rose-400/20",
};

export default function DashboardPage() {
  const [customScenario, setCustomScenario] = useState("");

  return (
    <div className="flex min-h-dvh flex-col pb-24">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[880px] -translate-x-1/2 rounded-full bg-accent/[0.06] blur-[120px]" />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-4 pt-8 pb-8 sm:px-6">
        <p className="mb-6 text-center text-[10px] font-medium tracking-[0.2em] text-muted/60 uppercase">
          Sales Master AI
        </p>

        <div className="mb-10 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-purple-500 text-sm font-bold text-white shadow-lg shadow-accent/25"
              aria-hidden
            >
              D
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                Welcome back, Diego
              </h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex max-w-full items-center truncate rounded-full border border-accent/35 bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium text-accent">
                  Founder / Fundraising
                </span>
              </div>
            </div>
          </div>

          <div
            className="shrink-0 rounded-2xl border border-border/60 bg-card/60 px-4 py-3 text-center backdrop-blur-sm"
            role="status"
            aria-label="7 day practice streak"
          >
            <div className="flex items-center justify-center gap-1 text-amber-400">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M12 2c.3 0 .6.1.8.3l1.5 1.5c.2.2.5.3.8.3h2c.6 0 1 .4 1 1v2c0 .3.1.6.3.8l1.5 1.5c.4.4.4 1 0 1.4l-1.5 1.5c-.2.2-.3.5-.3.8v2c0 .6-.4 1-1 1h-2c-.3 0-.6.1-.8.3l-1.5 1.5c-.4.4-1 .4-1.4 0l-1.5-1.5c-.2-.2-.5-.3-.8-.3H7c-.6 0-1-.4-1-1v-2c0-.3-.1-.6-.3-.8L4.2 10.3c-.4-.4-.4-1 0-1.4l1.5-1.5c.2-.2.3-.5.3-.8V4.6c0-.6.4-1 1-1h2c.3 0 .6-.1.8-.3l1.5-1.5c.2-.2.5-.3.8-.3z" />
              </svg>
              <span className="text-xl font-bold tabular-nums text-white">7</span>
            </div>
            <p className="mt-0.5 text-[10px] font-medium text-muted">day streak</p>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="text-xs font-medium tracking-wider text-muted/70 uppercase">
            Your personalized scenarios
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        <p className="mb-6 text-center text-xs text-muted/55">
          Matched to your Founder / Fundraising profile
        </p>

        <ul className="mb-12 space-y-3">
          {scenarios.map((s) => (
            <li key={s.id}>
              <div className="group flex w-full items-start gap-4 rounded-xl border border-border/50 bg-card/50 p-4 transition-all duration-200 hover:border-border hover:bg-card">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${s.gradient} text-sm font-bold text-white shadow-md`}
                  aria-hidden
                >
                  {s.initial}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-100">
                      {s.title}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${difficultyStyles[s.difficulty]}`}
                    >
                      {s.difficulty}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    with {s.character} · {s.duration}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted/75">
                    {s.description}
                  </p>
                </div>
                <span className="mt-1 shrink-0 rounded-lg border border-border/40 bg-white/[0.04] px-2 py-1 text-[10px] font-semibold text-muted group-hover:border-accent/30 group-hover:text-accent">
                  Start
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="text-xs font-medium tracking-wider text-muted/70 uppercase">
            Practice custom scenario
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        <p className="mb-5 text-center text-xs text-muted/55">
          Describe any situation — we will shape the roleplay around it
        </p>

        <div className="rounded-xl border border-border/50 bg-card/50 transition-colors focus-within:border-accent/40 focus-within:bg-card">
          <textarea
            value={customScenario}
            onChange={(e) => setCustomScenario(e.target.value)}
            placeholder="e.g. A board member is challenging our burn rate and the rationale for a bridge round..."
            rows={4}
            className="w-full resize-none rounded-xl bg-transparent px-4 pt-4 pb-14 text-sm leading-relaxed text-white placeholder:text-muted/45 focus:outline-none"
            aria-label="Custom scenario description"
          />
          <div className="flex items-center justify-between border-t border-border/40 px-3 py-3">
            <span className="text-[10px] text-muted/40 tabular-nums">
              {customScenario.length > 0 ? `${customScenario.length} characters` : ""}
            </span>
            <button
              type="button"
              disabled={customScenario.trim().length === 0}
              className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold transition-all duration-200 ${
                customScenario.trim().length > 0
                  ? "bg-accent text-white shadow-[0_0_24px_-6px_rgba(167,139,250,0.55)] hover:brightness-110"
                  : "cursor-not-allowed bg-zinc-800 text-zinc-500"
              }`}
            >
              Continue
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
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
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border/50 bg-background/85 backdrop-blur-xl"
        aria-label="Primary"
      >
        <div className="mx-auto flex max-w-2xl items-stretch justify-around px-1 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {[
            {
              id: "home",
              label: "Home",
              active: true,
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              ),
            },
            {
              id: "roleplays",
              label: "Roleplays",
              active: false,
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                />
              ),
            },
            {
              id: "progress",
              label: "Progress",
              active: false,
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              ),
            },
            {
              id: "settings",
              label: "Settings",
              active: false,
              icon: (
                <>
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
                </>
              ),
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg py-2 transition-colors ${
                tab.active ? "text-accent" : "text-muted/45 hover:text-muted"
              }`}
            >
              <svg
                className="h-5 w-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden
              >
                {tab.icon}
              </svg>
              <span className="truncate text-[10px] font-medium">{tab.label}</span>
              {tab.active ? (
                <span className="h-0.5 w-5 rounded-full bg-accent" aria-hidden />
              ) : (
                <span className="h-0.5 w-5" aria-hidden />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
