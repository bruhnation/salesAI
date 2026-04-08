"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DescribeJob() {
  const router = useRouter();
  const [description, setDescription] = useState("");

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-2xl">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-white"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back
        </button>

        {/* Step indicator */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent">
              1
            </div>
            <div className="h-px w-8 bg-accent/30" />
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-accent/50 bg-accent/10 text-xs font-semibold text-accent">
              2
            </div>
            <div className="h-px w-8 bg-border" />
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-xs font-medium text-muted">
              3
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Tell us about your
            <span className="bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
              {" "}
              role
            </span>
          </h1>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-muted">
            Describe what you do day-to-day. The more detail you share, the
            better we can tailor your coaching scenarios.
          </p>
        </div>

        {/* Text area with mic button */}
        <div className="group relative rounded-xl border border-border/50 bg-card/50 transition-colors focus-within:border-accent/40 focus-within:bg-card">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. I'm a Series A startup founder raising a $5M round. I pitch to VCs weekly and need help handling tough questions about our unit economics and competitive landscape..."
            rows={7}
            className="w-full resize-none rounded-xl bg-transparent px-5 pt-5 pb-14 text-sm leading-relaxed text-white placeholder:text-muted/50 focus:outline-none"
          />

          {/* Bottom toolbar */}
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            {/* Character hint */}
            <span className="text-xs text-muted/40 tabular-nums">
              {description.length > 0 && `${description.length} chars`}
            </span>

            {/* Microphone button (placeholder) */}
            <button
              type="button"
              title="Voice input (coming soon)"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-white/[0.03] text-muted transition-colors hover:border-border hover:bg-white/[0.06] hover:text-white"
            >
              <svg
                className="h-4.5 w-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Helper text */}
        <p className="mt-3 text-xs text-muted/50">
          Don&apos;t worry about getting it perfect — you can refine this later.
        </p>

        {/* Continue button */}
        <div className="mt-8 flex justify-center">
          <button
            disabled={description.trim().length === 0}
            onClick={() => router.push("/session")}
            className={`relative inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-semibold tracking-wide transition-all duration-300 ${
              description.trim().length > 0
                ? "bg-accent text-white shadow-[0_0_32px_-4px_rgba(167,139,250,0.5)] hover:shadow-[0_0_48px_-4px_rgba(167,139,250,0.65)] hover:brightness-110"
                : "cursor-not-allowed bg-zinc-800 text-zinc-500"
            }`}
          >
            Continue
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
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
  );
}
