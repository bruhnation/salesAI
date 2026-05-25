import { getRecentSessions } from "@/lib/firebase";

/** Monday 00:00 local time for the current week. */
export function getWeekStartMs(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function getWeekResetLabel() {
  const now = new Date();
  const day = now.getDay();
  const daysUntilMonday = day === 0 ? 1 : 8 - day;
  if (daysUntilMonday === 1) return "Resets tomorrow";
  return `Resets in ${daysUntilMonday} days`;
}

export async function getWeeklyCallCount() {
  const weekStart = getWeekStartMs();
  const sessions = await getRecentSessions(100);
  return sessions.filter((session) => session.completedAtMs >= weekStart).length;
}

export type WeeklyMilestone = {
  id: string;
  tier: string;
  calls: number;
  description: string;
};

export const weeklyMilestones: WeeklyMilestone[] = [
  {
    id: "first",
    tier: "On the board",
    calls: 1,
    description: "Complete your first call this week",
  },
  {
    id: "consistent",
    tier: "Consistent",
    calls: 5,
    description: "5 calls — building the habit",
  },
  {
    id: "grinder",
    tier: "Grinder",
    calls: 10,
    description: "10 calls — league-ready pace",
  },
  {
    id: "closer",
    tier: "Closer",
    calls: 20,
    description: "20 calls — top-rep territory",
  },
];

export function getCurrentMilestone(weeklyCalls: number) {
  let current = weeklyMilestones[0];
  for (const milestone of weeklyMilestones) {
    if (weeklyCalls >= milestone.calls) current = milestone;
  }
  return current;
}

export function getNextMilestone(weeklyCalls: number) {
  return weeklyMilestones.find((milestone) => weeklyCalls < milestone.calls) ?? null;
}
