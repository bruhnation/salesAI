"use client";

import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  Suspense,
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { recordSessionCompletion } from "@/lib/firebase";
import { getSessionScenario } from "@/lib/session-scenario-presets";
import {
  buildPersonalizationContext,
  canStartCall,
  getUserProfile,
  recordProfileCallCompletion,
  type UserProfile,
} from "@/lib/user-profile";

interface Message {
  id: string;
  role: "ai" | "user";
  text: string;
  timestamp: string;
}

/** Fixed locale + options so SSR (Node) and the browser render identical strings — avoids hydration mismatch. */
function formatTime(date: Date = new Date()) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function SessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scenarioTitle = searchParams.get("scenario");
  const characterName = searchParams.get("character");
  const objection = searchParams.get("objection");

  const sessionConfig = useMemo(
    () => getSessionScenario(scenarioTitle, characterName, objection),
    [scenarioTitle, characterName, objection]
  );

  const { scenarioPrompt, openingMessage, visual } = sessionConfig;

  const sessionKey = `${scenarioTitle ?? ""}|${characterName ?? ""}|${objection ?? ""}`;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileReady, setProfileReady] = useState(false);

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "1",
      role: "ai",
      text: openingMessage,
      timestamp: formatTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    setMessages([
      {
        id: "1",
        role: "ai",
        text: openingMessage,
        timestamp: formatTime(),
      },
    ]);
  }, [sessionKey, openingMessage]);

  useEffect(() => {
    void getUserProfile().then((next) => {
      setProfile(next);
      setProfileReady(true);
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    setSendError(null);
    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
      timestamp: formatTime(),
    };

    const priorForApi = messages.map((m) => ({
      role: m.role,
      text: m.text,
    }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setIsSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: scenarioPrompt,
          userMessage: trimmed,
          history: priorForApi,
          personalization: profile
            ? buildPersonalizationContext(profile)
            : undefined,
        }),
      });

      const data = (await res.json()) as { message?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      const reply = data.message?.trim();
      if (!reply) {
        throw new Error("No message in response");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "ai",
          text: reply,
          timestamp: formatTime(),
        },
      ]);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Something went wrong. Try again.";
      setSendError(msg);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleEndSession = async () => {
    if (isEnding) return;
    setIsEnding(true);
    try {
      await recordSessionCompletion({
        scenario: scenarioTitle ?? visual.bannerText,
        character: characterName ?? visual.headerName,
        messages: messages.map(({ role, text, timestamp }) => ({
          role,
          text,
          timestamp,
        })),
      });
      await recordProfileCallCompletion();
      router.push("/calls");
    } catch (error) {
      setSendError(
        error instanceof Error
          ? error.message
          : "Could not save this session. Try again."
      );
      setIsEnding(false);
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  const canSend = input.trim().length > 0 && !isSending;
  const callAllowed = profile ? canStartCall(profile) : true;

  const aiAvatarClass = `bg-gradient-to-br ${visual.avatarGradient}`;

  if (!profileReady) {
    return <SessionFallback />;
  }

  if (profile && !callAllowed) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center text-white">
        <h1 className="text-2xl font-black">Daily limit reached</h1>
        <p className="mt-3 max-w-sm text-sm text-muted">
          You&apos;ve used all 3 free calls today. Upgrade for unlimited
          practice or come back tomorrow.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 w-full max-w-sm rounded-full bg-accent py-3 text-sm font-bold text-zinc-950"
        >
          Back to Home
        </Link>
        <button
          type="button"
          className="mt-3 w-full max-w-sm rounded-full border border-border py-3 text-sm font-semibold text-muted"
        >
          Upgrade to Premium
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/dashboard"
            aria-label="Back to dashboard"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/[0.06] hover:text-white"
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
          </Link>

          <div className="relative">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${aiAvatarClass} text-sm font-bold text-white shadow-lg shadow-amber-500/20`}
            >
              {visual.aiAvatarInitial}
            </div>
            <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-background bg-accent" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-white">
              {visual.headerName}
            </h2>
            <p className="text-xs text-muted">{visual.roleSubtitle}</p>
          </div>

          <div className="hidden items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1 sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            <span className="text-xs font-medium text-muted">Live Session</span>
          </div>

          <button
            type="button"
            onClick={() => void handleEndSession()}
            disabled={isEnding}
            className="rounded-lg border border-border/50 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          >
            {isEnding ? "Saving" : "End"}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <div className="mb-6 rounded-xl border border-border/40 bg-card/40 p-4 text-center">
            <div className="mb-1 text-xs font-medium tracking-wider text-accent uppercase">
              Scenario
            </div>
            <p className="text-sm leading-relaxed text-muted">
              {visual.bannerText}
            </p>
          </div>

          <div className="space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {msg.role === "ai" ? (
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${aiAvatarClass} text-xs font-bold text-white`}
                  >
                    {visual.aiAvatarInitial}
                  </div>
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                    You
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "ai"
                        ? "rounded-tl-md border border-border/40 bg-card text-zinc-200"
                        : "rounded-tr-md bg-accent/15 text-zinc-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div
                    className={`mt-1 px-1 text-[10px] text-muted/40 ${
                      msg.role === "user" ? "text-right" : ""
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${aiAvatarClass} text-xs font-bold text-white`}
                >
                  {visual.aiAvatarInitial}
                </div>
                <div className="rounded-2xl rounded-tl-md border border-border/40 bg-card px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="sticky bottom-0 z-20 border-t border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
          {sendError && (
            <div className="mb-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {sendError}
            </div>
          )}
          <div className="mb-2 flex items-center gap-1.5 text-[11px] text-muted/50">
            <svg
              className="h-3 w-3 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
              />
            </svg>
            <span>
              Tip: Address their concern with specific metrics and a clear
              framework.
            </span>
          </div>

          <div className="flex items-end gap-2">
            <div className="relative flex-1 rounded-xl border border-border/50 bg-card/50 transition-colors focus-within:border-accent/40 focus-within:bg-card">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaInput}
                onKeyDown={handleKeyDown}
                placeholder="Type your response..."
                rows={1}
                disabled={isSending}
                className="max-h-40 w-full resize-none bg-transparent px-4 py-3 pr-12 text-sm leading-relaxed text-white placeholder:text-muted/50 focus:outline-none disabled:opacity-60"
              />

              <button
                type="button"
                title="Voice input (coming soon)"
                disabled={isSending}
                className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/[0.06] hover:text-white disabled:pointer-events-none disabled:opacity-40"
              >
                <svg
                  className="h-4 w-4"
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

            <button
              type="button"
              onClick={() => void handleSend()}
              disabled={!canSend}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
                canSend
                  ? "bg-accent text-white shadow-[0_0_20px_-4px_rgba(167,139,250,0.5)] hover:brightness-110"
                  : "cursor-not-allowed bg-zinc-800 text-zinc-500"
              }`}
            >
              {isSending ? (
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
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
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionFallback() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-[#09090b] px-4">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      <p className="text-sm text-muted">Loading session…</p>
    </div>
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={<SessionFallback />}>
      <SessionContent />
    </Suspense>
  );
}
