let reminderTimer: ReturnType<typeof setTimeout> | null = null;

const reminderCopy = [
  (streak: number) => `Your prospect is waiting 👀 Day ${streak} on the line.`,
  () => "3 minutes. One call. Don't break the chain 🔥",
  () => "Sarah just answered her door. Where are you?",
];

function nextSixPmMs() {
  const now = new Date();
  const next = new Date();
  next.setHours(18, 0, 0, 0);
  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }
  return next.getTime() - now.getTime();
}

export function scheduleDailyReminder(enabled: boolean, streak = 0) {
  if (typeof window === "undefined") return;
  if (reminderTimer) {
    clearTimeout(reminderTimer);
    reminderTimer = null;
  }
  if (!enabled || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const delay = nextSixPmMs();
  reminderTimer = setTimeout(() => {
    const template =
      reminderCopy[Math.floor(Math.random() * reminderCopy.length)];
    new Notification("Sales Coach", { body: template(streak) });
    scheduleDailyReminder(enabled, streak);
  }, delay);
}
