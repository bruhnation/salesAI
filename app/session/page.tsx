"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  role: "ai" | "user";
  text: string;
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "ai",
    text: "Good afternoon. I've reviewed your deck — interesting market you're going after. But let me be direct: your Series A ask is $5 million, yet your MRR is still under $80K. Walk me through why I should believe this is a $100M+ outcome.",
    timestamp: "2:00 PM",
  },
  {
    id: "2",
    role: "user",
    text: "Thanks for taking the time, Michael. You're right that our revenue is early, but our growth trajectory tells a different story — we've 4x'd MRR in the last 6 months with zero paid acquisition. Our NRR is 145%, which means once customers land, they expand fast.",
    timestamp: "2:01 PM",
  },
  {
    id: "3",
    role: "ai",
    text: "Net retention is solid, I'll give you that. But 4x off a small base isn't uncommon at your stage. What's your CAC payback period, and how does that change when you actually start spending on acquisition?",
    timestamp: "2:02 PM",
  },
];

export default function Session() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  return (
    <div className="flex h-full min-h-dvh flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          {/* Back */}
          <button
            onClick={() => router.back()}
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
          </button>

          {/* Avatar */}
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-sm font-bold text-white shadow-lg shadow-amber-500/20">
              M
            </div>
            <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-400" />
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-white">Michael</h2>
            <p className="text-xs text-muted">Skeptical Investor · Active</p>
          </div>

          {/* Session badge */}
          <div className="hidden items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1 sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-xs font-medium text-muted">Live Session</span>
          </div>

          {/* End session */}
          <button className="rounded-lg border border-border/50 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400">
            End
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          {/* Scenario banner */}
          <div className="mb-6 rounded-xl border border-border/40 bg-card/40 p-4 text-center">
            <div className="mb-1 text-xs font-medium tracking-wider text-accent uppercase">
              Scenario
            </div>
            <p className="text-sm leading-relaxed text-muted">
              Series A pitch meeting — Michael is a senior partner at a top-tier
              VC fund. He&apos;s seen 200+ decks this quarter and leads with
              tough financial questions.
            </p>
          </div>

          {/* Message list */}
          <div className="space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                {msg.role === "ai" ? (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-xs font-bold text-white">
                    M
                  </div>
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                    You
                  </div>
                )}

                {/* Bubble */}
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
          </div>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="sticky bottom-0 z-20 border-t border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
          {/* Coaching hint */}
          <div className="mb-2 flex items-center gap-1.5 text-[11px] text-muted/50">
            <svg
              className="h-3 w-3"
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
              Tip: Address his concern with specific metrics and a clear
              framework.
            </span>
          </div>

          <div className="flex items-end gap-2">
            {/* Textarea */}
            <div className="relative flex-1 rounded-xl border border-border/50 bg-card/50 transition-colors focus-within:border-accent/40 focus-within:bg-card">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaInput}
                onKeyDown={handleKeyDown}
                placeholder="Type your response..."
                rows={1}
                className="max-h-40 w-full resize-none bg-transparent px-4 py-3 pr-12 text-sm leading-relaxed text-white placeholder:text-muted/50 focus:outline-none"
              />

              {/* Mic button */}
              <button
                type="button"
                title="Voice input (coming soon)"
                className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/[0.06] hover:text-white"
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

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={input.trim().length === 0}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
                input.trim().length > 0
                  ? "bg-accent text-white shadow-[0_0_20px_-4px_rgba(167,139,250,0.5)] hover:brightness-110"
                  : "bg-zinc-800 text-zinc-500"
              }`}
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
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
