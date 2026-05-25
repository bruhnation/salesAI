export type Difficulty = "Easy" | "Medium" | "Hard" | "Expert";

export type CustomerAvatar = {
  id: string;
  name: string;
  age: number;
  market: string;
  difficulty: Difficulty;
  summary: string;
  objection: string;
  gradient: string;
  accent: string;
  imageClass: string;
};

export type TrainingScenario = {
  id: string;
  title: string;
  character: string;
  category: string;
  difficulty: Difficulty;
  duration: string;
  prompt: string;
  gradient: string;
};

export type Meeting = {
  id: string;
  title: string;
  account: string;
  type: "Upcoming" | "AI Roleplay" | "Ridealong";
  time: string;
  status: "Ready" | "Needs prep" | "Connected";
};

export type MetricsSummary = {
  xp: number;
  level: number;
  streak: number;
  callsCompleted: number;
  winRate: number;
  objectionScore: number;
  talkListenBalance: number;
};

export type SessionRecord = {
  id: string;
  scenario: string;
  character: string;
  completedAtMs: number;
  xpAwarded: number;
  messages: Array<{ role: "ai" | "user"; text: string; timestamp: string }>;
};

export const defaultMetrics: MetricsSummary = {
  xp: 0,
  level: 1,
  streak: 0,
  callsCompleted: 0,
  winRate: 0,
  objectionScore: 0,
  talkListenBalance: 0,
};

export const customerAvatars: CustomerAvatar[] = [
  {
    id: "mark-liquidity",
    name: "Mark",
    age: 48,
    market: "US",
    difficulty: "Hard",
    summary: "CFO buyer, skeptical about cash timing and proof of ROI.",
    objection: "How quickly can Chill secure liquidity?",
    gradient: "from-emerald-500 to-teal-400",
    accent: "text-emerald-300",
    imageClass: "from-zinc-700 via-zinc-500 to-zinc-900",
  },
  {
    id: "bobby-pragmatic",
    name: "Bobby",
    age: 47,
    market: "US",
    difficulty: "Easy",
    summary: "Pragmatic, dry humor, wants a fast business case.",
    objection: "I need this to pay for itself this quarter.",
    gradient: "from-blue-500 to-cyan-400",
    accent: "text-emerald-300",
    imageClass: "from-blue-900 via-zinc-500 to-zinc-900",
  },
  {
    id: "brenda-champion",
    name: "Brenda",
    age: 27,
    market: "US",
    difficulty: "Medium",
    summary: "Warm champion, easy to engage, careful with internal buy-in.",
    objection: "My manager likes the idea, but budget is tight.",
    gradient: "from-orange-400 to-pink-400",
    accent: "text-amber-300",
    imageClass: "from-orange-200 via-rose-300 to-zinc-700",
  },
  {
    id: "caleb-technical",
    name: "Caleb",
    age: 40,
    market: "US",
    difficulty: "Medium",
    summary: "Technical evaluator who keeps pushing for implementation detail.",
    objection: "We already signed with someone else last month.",
    gradient: "from-purple-500 to-indigo-400",
    accent: "text-amber-300",
    imageClass: "from-purple-300 via-cyan-200 to-zinc-800",
  },
  {
    id: "calum-operator",
    name: "Calum",
    age: 35,
    market: "US",
    difficulty: "Hard",
    summary: "Operator who wants practical roll-out steps and risk control.",
    objection: "This sounds useful, but switching costs scare me.",
    gradient: "from-slate-500 to-zinc-300",
    accent: "text-rose-300",
    imageClass: "from-slate-300 via-zinc-500 to-zinc-950",
  },
];

export const trainingScenarios: TrainingScenario[] = [
  {
    id: "skeptical-vc",
    title: "The Skeptical VC",
    character: "Michael Chen",
    category: "Fundraising",
    difficulty: "Hard",
    duration: "15 min",
    prompt: "Defend your Series A metrics against a partner who has seen hundreds of decks this quarter.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "technical-dd",
    title: "Technical Due Diligence",
    character: "Sarah Park",
    category: "Discovery",
    difficulty: "Medium",
    duration: "12 min",
    prompt: "Walk a technical evaluator through your product architecture and defensibility.",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "term-sheet",
    title: "Term Sheet Negotiation",
    character: "David Russo",
    category: "Negotiation",
    difficulty: "Expert",
    duration: "20 min",
    prompt: "Navigate valuation, preferences, and board composition with a lead investor.",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    id: "price-objection",
    title: "Price Pressure",
    character: "Nina Alvarez",
    category: "Objection",
    difficulty: "Medium",
    duration: "10 min",
    prompt: "Handle a buyer who likes the product but is pushing for a deep discount.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    id: "renewal-risk",
    title: "Renewal At Risk",
    character: "Jordan Lee",
    category: "Renewal",
    difficulty: "Hard",
    duration: "14 min",
    prompt: "Save an expansion account after adoption slipped in the last quarter.",
    gradient: "from-violet-500 to-fuchsia-500",
  },
];

export const starterMeetings: Meeting[] = [
  {
    id: "ai-roleplay-cfo",
    title: "CFO objection rehearsal",
    account: "Acme Capital",
    type: "AI Roleplay",
    time: "Today, 4:00 PM",
    status: "Ready",
  },
  {
    id: "ridealong-demo",
    title: "Demo call ride-along",
    account: "Northstar Labs",
    type: "Ridealong",
    time: "Tomorrow, 10:30 AM",
    status: "Needs prep",
  },
];

export const integrations = [
  "Google Calendar",
  "Outlook",
  "Zoom",
  "Google Meet",
  "HubSpot",
  "Salesforce",
];

export function buildSessionHref(title: string, character: string) {
  return `/session?${new URLSearchParams({
    scenario: title,
    character,
  }).toString()}`;
}
