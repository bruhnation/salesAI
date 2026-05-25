import type { Industry } from "@/lib/user-profile";

export type Prospect = {
  id: string;
  name: string;
  age: number;
  industry: Industry;
  situation: string;
  objection: string;
  imageClass: string;
};

export const prospects: Prospect[] = [
  {
    id: "mark-lawn",
    name: "Mark",
    age: 48,
    industry: "door_to_door",
    situation: "Suburban homeowner, just got home from work",
    objection: "I already have a lawn guy.",
    imageClass: "from-zinc-700 via-stone-500 to-zinc-900",
  },
  {
    id: "sandra-pest",
    name: "Sandra",
    age: 52,
    industry: "door_to_door",
    situation: "Busy mom, kids in the driveway",
    objection: "We don't need pest control right now.",
    imageClass: "from-amber-900 via-orange-700 to-zinc-900",
  },
  {
    id: "derek-solar",
    name: "Derek",
    age: 39,
    industry: "door_to_door",
    situation: "Renter who thinks solar doesn't apply",
    objection: "I'm not the homeowner, talk to my landlord.",
    imageClass: "from-slate-600 via-blue-900 to-zinc-950",
  },
  {
    id: "linda-insurance",
    name: "Linda",
    age: 44,
    industry: "insurance",
    situation: "Working from home, skeptical of cold calls",
    objection: "I already have coverage through work.",
    imageClass: "from-rose-900 via-zinc-600 to-zinc-900",
  },
  {
    id: "carlos-insurance",
    name: "Carlos",
    age: 36,
    industry: "insurance",
    situation: "Recently married, comparing quotes",
    objection: "Your price is higher than what I found online.",
    imageClass: "from-indigo-900 via-slate-600 to-zinc-950",
  },
  {
    id: "tanya-auto",
    name: "Tanya",
    age: 31,
    industry: "auto_sales",
    situation: "Walk-in on the lot, price shopping",
    objection: "I can get this cheaper at the dealer down the street.",
    imageClass: "from-cyan-900 via-zinc-600 to-zinc-950",
  },
  {
    id: "james-auto",
    name: "James",
    age: 55,
    industry: "auto_sales",
    situation: "Trade-in customer, focused on monthly payment",
    objection: "I need to talk to my wife before I decide.",
    imageClass: "from-neutral-700 via-zinc-500 to-zinc-900",
  },
  {
    id: "kayla-gym",
    name: "Kayla",
    age: 26,
    industry: "gym_fitness",
    situation: "Front desk walk-in after a trial class",
    objection: "I'm not sure I'll actually come enough to justify it.",
    imageClass: "from-fuchsia-900 via-purple-800 to-zinc-950",
  },
  {
    id: "mike-gym",
    name: "Mike",
    age: 34,
    industry: "gym_fitness",
    situation: "Former member who cancelled last year",
    objection: "I cancelled because I never used it.",
    imageClass: "from-orange-900 via-red-900 to-zinc-950",
  },
  {
    id: "priya-saas",
    name: "Priya",
    age: 41,
    industry: "b2b_saas",
    situation: "Ops manager, short on time",
    objection: "We already have a tool for this.",
    imageClass: "from-blue-900 via-indigo-800 to-zinc-950",
  },
  {
    id: "nate-saas",
    name: "Nate",
    age: 38,
    industry: "b2b_saas",
    situation: "Founder doing their own outbound",
    objection: "Send me an email and I'll look when I have time.",
    imageClass: "from-slate-700 via-zinc-600 to-zinc-900",
  },
  {
    id: "rosa-other",
    name: "Rosa",
    age: 43,
    industry: "other",
    situation: "Small business owner, guarded at the door",
    objection: "I'm busy — what is this about?",
    imageClass: "from-stone-700 via-zinc-600 to-zinc-900",
  },
];

export function filterProspects(
  industry: Industry | "",
  showAllIndustries: boolean
) {
  if (!industry || showAllIndustries) return prospects;
  return prospects.filter(
    (prospect) => prospect.industry === industry || prospect.industry === "other"
  );
}

export function industryLabel(industry: Industry | "") {
  const labels: Record<Industry, string> = {
    door_to_door: "Door-to-Door",
    insurance: "Insurance",
    auto_sales: "Auto Sales",
    gym_fitness: "Gym / Fitness",
    b2b_saas: "B2B / SaaS",
    other: "Other",
  };
  return industry ? labels[industry] : "All industries";
}

export function buildProspectSessionHref(prospect: Prospect) {
  return `/session?${new URLSearchParams({
    scenario: prospect.situation,
    character: `${prospect.name}, ${prospect.age}`,
    objection: prospect.objection,
  }).toString()}`;
}
