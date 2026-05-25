"use client";

import { useState } from "react";

import { saveAdvisorMessage } from "@/lib/firebase";

type AdvisorMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
};

const starterMessages: AdvisorMessage[] = [
  {
    id: "welcome",
    role: "ai",
    text: "Ask me anything about handling objections, follow-ups, discovery, pricing, or your next sales call.",
  },
];

export function AskSalesAIWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AdvisorMessage[]>(starterMessages);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async () => {
    const text = input.trim();
    if (!text || isSending) return;

    const userMessage: AdvisorMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsSending(true);
    setError(null);
    await saveAdvisorMessage(userMessage);

    try {
      const res = await fetch("/api/sales-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          history: messages.map(({ role, text: messageText }) => ({
            role,
            text: messageText,
          })),
        }),
      });

      const data = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      const reply: AdvisorMessage = {
        id: `a-${Date.now()}`,
        role: "ai",
        text: data.message?.trim() || "Try reframing that with a clearer buyer goal.",
      };
      setMessages((current) => [...current, reply]);
      await saveAdvisorMessage(reply);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sales AI is unavailable.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {open && (
        <section className="fixed inset-x-4 bottom-28 z-40 mx-auto max-w-md overflow-hidden rounded-3xl border border-emerald-400/25 bg-zinc-950/95 shadow-2xl shadow-emerald-500/20 backdrop-blur-xl">
          <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-300">
                Ask Sales AI
              </p>
              <h2 className="text-sm font-semibold text-white">Deal coach on demand</h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400 hover:text-white"
            >
              Close
            </button>
          </header>

          <div className="max-h-80 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  message.role === "ai"
                    ? "mr-8 border border-white/10 bg-white/[0.05] text-zinc-200"
                    : "ml-8 bg-emerald-400 text-zinc-950"
                }`}
              >
                {message.text}
              </div>
            ))}
            {isSending && (
              <div className="mr-8 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-zinc-400">
                Thinking...
              </div>
            )}
          </div>

          <div className="border-t border-white/10 p-3">
            {error && (
              <p className="mb-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {error}
              </p>
            )}
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void send();
                  }
                }}
                placeholder="Ask about your next objection..."
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
              />
              <button
                type="button"
                onClick={() => void send()}
                disabled={!input.trim() || isSending}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400 text-zinc-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
                aria-label="Ask Sales AI"
              >
                ^
              </button>
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="fixed bottom-[max(1.35rem,env(safe-area-inset-bottom))] right-4 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400 text-2xl font-black text-zinc-950 shadow-[0_0_32px_rgba(52,211,153,0.55)] transition hover:scale-105"
        aria-label="Ask Sales AI"
      >
        AI
      </button>
    </>
  );
}
