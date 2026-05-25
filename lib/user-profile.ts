"use client";

import { doc, getDoc, setDoc } from "firebase/firestore";

import { ensureFirebaseUser, getFirebaseDb } from "@/lib/firebase";

export type Industry =
  | "door_to_door"
  | "insurance"
  | "auto_sales"
  | "gym_fitness"
  | "b2b_saas"
  | "other";

export type ExperienceLevel =
  | "first_week"
  | "under_6_months"
  | "6_months_2_years"
  | "2_plus_years"
  | "veteran";

export type SubscriptionTier = "free" | "premium";

export type UserProfile = {
  name: string;
  industry: Industry | "";
  experience_level: ExperienceLevel | "";
  pitch_context: string;
  goals: string[];
  daily_goal: number;
  notifications_enabled: boolean;
  current_streak: number;
  last_call_date: string | null;
  last_streak_date: string | null;
  onboarded: boolean;
  free_calls_used_today: number;
  free_calls_reset_at: string | null;
  subscription_tier: SubscriptionTier;
  show_all_industries: boolean;
  calls_completed_today: number;
};

export const FREE_CALLS_PER_DAY = 3;

export const defaultUserProfile: UserProfile = {
  name: "",
  industry: "",
  experience_level: "",
  pitch_context: "",
  goals: [],
  daily_goal: 3,
  notifications_enabled: true,
  current_streak: 0,
  last_call_date: null,
  last_streak_date: null,
  onboarded: false,
  free_calls_used_today: 0,
  free_calls_reset_at: null,
  subscription_tier: "free",
  show_all_industries: false,
  calls_completed_today: 0,
};

export const industryOptions: Array<{
  id: Industry;
  emoji: string;
  label: string;
  subtitle: string;
}> = [
  {
    id: "door_to_door",
    emoji: "🏠",
    label: "Door-to-Door",
    subtitle: "Pressure Washing, Pest Control, Solar, Roofing, Lawn",
  },
  {
    id: "insurance",
    emoji: "📞",
    label: "Insurance",
    subtitle: "Life, auto, home, and final expense",
  },
  {
    id: "auto_sales",
    emoji: "🚗",
    label: "Auto Sales",
    subtitle: "Lot, dealership, and test-drive closes",
  },
  {
    id: "gym_fitness",
    emoji: "💪",
    label: "Gym / Fitness Memberships",
    subtitle: "Walk-ins, tours, and membership closes",
  },
  {
    id: "b2b_saas",
    emoji: "💼",
    label: "B2B / SaaS",
    subtitle: "Outbound, demos, and pipeline",
  },
  {
    id: "other",
    emoji: "📦",
    label: "Other",
    subtitle: "Any sales motion",
  },
];

export const experienceOptions: Array<{
  id: ExperienceLevel;
  label: string;
}> = [
  { id: "first_week", label: "First week 👶" },
  { id: "under_6_months", label: "Under 6 months" },
  { id: "6_months_2_years", label: "6 months – 2 years" },
  { id: "2_plus_years", label: "2+ years" },
  { id: "veteran", label: "Veteran" },
];

export const goalOptions = [
  "Opening / first 10 seconds",
  "Handling objections",
  "Closing",
  "Tone & confidence",
  "All of it",
];

export const dailyGoalOptions = [1, 3, 5, 10];

function localKey() {
  return "sales-master:user-profile";
}

function readLocalProfile(): UserProfile {
  if (typeof window === "undefined") return defaultUserProfile;
  try {
    const raw = window.localStorage.getItem(localKey());
    return raw
      ? { ...defaultUserProfile, ...(JSON.parse(raw) as Partial<UserProfile>) }
      : defaultUserProfile;
  } catch {
    return defaultUserProfile;
  }
}

function writeLocalProfile(profile: UserProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(localKey(), JSON.stringify(profile));
}

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return todayKey(d);
}

export function resetDailyCountersIfNeeded(profile: UserProfile): UserProfile {
  const today = todayKey();
  if (profile.free_calls_reset_at === today) return profile;

  return {
    ...profile,
    free_calls_used_today: 0,
    calls_completed_today: 0,
    free_calls_reset_at: today,
  };
}

export async function getUserProfile(): Promise<UserProfile> {
  let profile = readLocalProfile();
  profile = resetDailyCountersIfNeeded(profile);

  const user = await ensureFirebaseUser();
  const db = getFirebaseDb();
  if (!user || !db) {
    writeLocalProfile(profile);
    return profile;
  }

  const snap = await getDoc(doc(db, "users", user.uid, "state", "profile"));
  if (snap.exists()) {
    profile = resetDailyCountersIfNeeded({
      ...defaultUserProfile,
      ...(snap.data() as Partial<UserProfile>),
    });
    writeLocalProfile(profile);
  }

  return profile;
}

export async function saveUserProfile(
  patch: Partial<UserProfile>
): Promise<UserProfile> {
  const current = resetDailyCountersIfNeeded(await getUserProfile());
  const next = resetDailyCountersIfNeeded({ ...current, ...patch });
  writeLocalProfile(next);

  const user = await ensureFirebaseUser();
  const db = getFirebaseDb();
  if (user && db) {
    await setDoc(doc(db, "users", user.uid, "state", "profile"), next, {
      merge: true,
    });
  }

  return next;
}

export function getFreeCallsRemaining(profile: UserProfile) {
  const refreshed = resetDailyCountersIfNeeded(profile);
  if (refreshed.subscription_tier === "premium") return Infinity;
  return Math.max(0, FREE_CALLS_PER_DAY - refreshed.free_calls_used_today);
}

export function canStartCall(profile: UserProfile) {
  return getFreeCallsRemaining(profile) > 0;
}

export async function recordProfileCallCompletion(): Promise<UserProfile> {
  const profile = resetDailyCountersIfNeeded(await getUserProfile());
  const today = todayKey();
  const callsToday = profile.calls_completed_today + 1;
  const freeUsed = profile.free_calls_used_today + 1;

  let currentStreak = profile.current_streak;
  let lastStreakDate = profile.last_streak_date;

  if (callsToday >= profile.daily_goal && lastStreakDate !== today) {
    if (lastStreakDate === yesterdayKey() || profile.current_streak === 0) {
      currentStreak = profile.current_streak + 1;
    } else if (lastStreakDate !== today) {
      currentStreak = 1;
    }
    lastStreakDate = today;
  }

  if (
    profile.last_streak_date &&
    profile.last_streak_date !== today &&
    profile.last_streak_date !== yesterdayKey() &&
    callsToday < profile.daily_goal
  ) {
    currentStreak = 0;
  }

  return saveUserProfile({
    calls_completed_today: callsToday,
    free_calls_used_today: freeUsed,
    free_calls_reset_at: today,
    last_call_date: new Date().toISOString(),
    current_streak: currentStreak,
    last_streak_date: lastStreakDate,
  });
}

export function buildPersonalizationContext(profile: UserProfile) {
  const parts = [
    profile.name ? `Sales rep name: ${profile.name}` : "",
    profile.industry ? `Industry: ${profile.industry}` : "",
    profile.experience_level
      ? `Experience level: ${profile.experience_level}`
      : "",
    profile.pitch_context
      ? `Rep pitch context (from voice intro): ${profile.pitch_context}`
      : "",
    profile.goals.length > 0
      ? `Rep goals: ${profile.goals.join(", ")}`
      : "",
  ].filter(Boolean);

  return parts.join("\n");
}
