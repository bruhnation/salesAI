"use client";

import { useEffect, useState } from "react";

import { getUserProfile } from "@/lib/user-profile";

export function StreakBadge() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    void getUserProfile().then((profile) => setStreak(profile.current_streak));
  }, []);

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-streak/35 bg-streak-soft px-3 py-1.5 text-sm font-bold text-streak">
      <span aria-hidden>🔥</span>
      <span>{streak}</span>
    </div>
  );
}
