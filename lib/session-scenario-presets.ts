/** Maps dashboard scenario titles to session copy and API prompt context. */

export type SessionVisual = {
  headerName: string;
  roleSubtitle: string;
  bannerText: string;
  aiAvatarInitial: string;
  avatarGradient: string;
};

const firstName = (full: string) =>
  full.trim().split(/[\s,]+/)[0] ?? full;

export function getSessionScenario(
  scenarioTitle: string | null,
  characterName: string | null,
  objection?: string | null
): {
  scenarioPrompt: string;
  openingMessage: string;
  visual: SessionVisual;
} {
  const title = scenarioTitle?.trim() || "Series A pitch — Skeptical VC";
  const character = characterName?.trim() || "Michael Chen";
  const fn = firstName(character);
  const initial = fn[0]?.toUpperCase() ?? "?";
  const objectionText = objection?.trim();

  if (objectionText) {
    return {
      scenarioPrompt: `You are ${character}, a realistic sales prospect in this situation: ${title}. Your primary objection (use it naturally, not as a script): "${objectionText}". React believably to what the salesperson says — push back, ask questions, or soften when they earn it. Stay in character as ${fn} only. Do not mention AI or roleplay.`,
      openingMessage: objectionText.startsWith('"')
        ? objectionText
        : `"${objectionText}"`,
      visual: {
        headerName: `${fn}${character.includes(",") ? `, ${character.split(",")[1]?.trim()}` : ""}`,
        roleSubtitle: "Prospect · Live",
        bannerText: title,
        aiAvatarInitial: initial,
        avatarGradient: "from-orange-600 to-amber-700",
      },
    };
  }

  const preset = PRESETS[title];
  if (preset) {
    return {
      scenarioPrompt: preset.buildPrompt(character),
      openingMessage: preset.opening(character),
      visual: preset.visual(character, initial),
    };
  }

  return {
    scenarioPrompt: `Sales roleplay scenario: "${title}". You are ${character}, the prospect or counterparty in this conversation. Stay realistic, react to what the salesperson says, and push back when it fits your incentives. Do not break character.`,
    openingMessage: `I'm ${fn}. You're pitching me — start wherever makes sense for "${title}", and I'll react like a real buyer would.`,
    visual: {
      headerName: fn,
      roleSubtitle: "Prospect · Active",
      bannerText: `${title} — you are meeting with ${character}.`,
      aiAvatarInitial: initial,
      avatarGradient: "from-amber-500 to-orange-600",
    },
  };
}

const PRESETS: Record<
  string,
  {
    buildPrompt: (character: string) => string;
    opening: (character: string) => string;
    visual: (character: string, initial: string) => SessionVisual;
  }
> = {
  "The Skeptical VC": {
    buildPrompt: (character) =>
      `Series A pitch meeting — ${character} is a senior partner at a top-tier VC fund. They have seen 200+ decks this quarter and lead with tough financial questions. Their communication style is direct and skeptical but fair. Stay in character as ${character} only.`,
    opening: () =>
      "Good afternoon. I've reviewed your deck — interesting market you're going after. But let me be direct: your Series A ask is $5 million, yet your MRR is still under $80K. Walk me through why I should believe this is a $100M+ outcome.",
    visual: (character, initial) => ({
      headerName: firstName(character),
      roleSubtitle: "Skeptical Investor · Active",
      bannerText: `Series A pitch meeting — ${character} is a senior partner at a top-tier VC fund. They've seen 200+ decks this quarter and lead with tough financial questions.`,
      aiAvatarInitial: initial,
      avatarGradient: "from-amber-500 to-orange-600",
    }),
  },
  "Technical Due Diligence": {
    buildPrompt: (character) =>
      `Technical due diligence call — ${character} is a technical LP / engineer assessing your product architecture, security posture, and engineering moat before a commitment. They ask precise, probing questions. Stay in character as ${character} only.`,
    opening: (character) =>
      `Hi, I'm ${firstName(character)}. I've skimmed your architecture overview — before we go further, help me understand how you handle tenant isolation at scale and what happens to customer data if you migrate regions.`,
    visual: (character, initial) => ({
      headerName: firstName(character),
      roleSubtitle: "Technical LP · Active",
      bannerText: `Technical diligence — ${character} is evaluating your stack, security model, and long-term defensibility.`,
      aiAvatarInitial: initial,
      avatarGradient: "from-cyan-500 to-blue-600",
    }),
  },
  "Term Sheet Negotiation": {
    buildPrompt: (character) =>
      `Term sheet negotiation — ${character} is a lead investor negotiating valuation, liquidation preferences, pro rata, and board composition. They are experienced, firm, and detail-oriented. Stay in character as ${character} only.`,
    opening: () =>
      "Thanks for sending the draft term sheet. Before we go line by line — walk me through why a 1x non-participating liquidation preference still makes sense at this valuation, and where you're flexible.",
    visual: (character, initial) => ({
      headerName: firstName(character),
      roleSubtitle: "Lead Investor · Active",
      bannerText: `Term sheet discussion — ${character} is negotiating economics, control, and protections with you at the table.`,
      aiAvatarInitial: initial,
      avatarGradient: "from-rose-500 to-pink-600",
    }),
  },
};
