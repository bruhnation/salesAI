import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

/** Override with GEMINI_MODEL in .env.local (e.g. gemini-1.5-flash if you hit quota limits on 2.0). */
function getModelName() {
  const fromEnv = process.env.GEMINI_MODEL?.trim();
  if (fromEnv) return fromEnv;
  return "gemini-2.0-flash";
}

type ChatTurn = { role: "user" | "ai"; text: string };

function buildPrompt(
  scenario: string,
  userMessage: string,
  history: ChatTurn[],
  personalization?: string
) {
  const transcript =
    history.length > 0
      ? `\nConversation so far:\n${history
          .map((m) =>
            m.role === "user"
              ? `Salesperson: ${m.text}`
              : `Prospect (you): ${m.text}`
          )
          .join("\n\n")}\n`
      : "";

  const repContext = personalization?.trim()
    ? `\nAbout the salesperson (personalize your reactions to their industry and pitch):\n${personalization.trim()}\n`
    : "";

  return `You are roleplaying as a realistic sales prospect. Stay in character for the entire reply.

Scenario (context for who you are and what is happening):
${scenario}
${repContext}${transcript}
The salesperson just said:
"""${userMessage}"""

Respond as this prospect would in a real conversation: natural tone, believable objections or interest, and specific enough to feel human. Keep it concise unless a longer reply fits the moment. Do not mention being an AI, a model, or a roleplay. Do not give meta commentary—only the prospect's words.`;
}

export async function POST(request: Request) {
  const apiKey =
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    process.env.GOOGLE_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "GEMINI_API_KEY is not set. Add GEMINI_API_KEY=your_key to .env.local in the project root, then restart `npm run dev`.",
      },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Expected JSON object" }, { status: 400 });
  }

  const { scenario, userMessage, history, personalization } = body as Record<
    string,
    unknown
  >;
  const scenarioText =
    typeof scenario === "string" ? scenario.trim() : "";
  const userText =
    typeof userMessage === "string" ? userMessage.trim() : "";
  const personalizationText =
    typeof personalization === "string" ? personalization.trim() : "";

  if (!scenarioText || !userText) {
    return NextResponse.json(
      { error: "Fields 'scenario' and 'userMessage' are required non-empty strings" },
      { status: 400 }
    );
  }

  const priorTurns: ChatTurn[] = [];
  if (Array.isArray(history)) {
    for (const item of history) {
      if (!item || typeof item !== "object") continue;
      const rec = item as Record<string, unknown>;
      const role = rec.role;
      const text = rec.text;
      if (
        (role === "user" || role === "ai") &&
        typeof text === "string" &&
        text.trim()
      ) {
        priorTurns.push({ role, text: text.trim() });
      }
    }
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: getModelName() });

    const result = await model.generateContent(
      buildPrompt(scenarioText, userText, priorTurns, personalizationText)
    );
    const response = result.response;
    const message = response.text().trim();

    if (!message) {
      return NextResponse.json(
        { error: "Empty response from model" },
        { status: 502 }
      );
    }

    return NextResponse.json({ message });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to generate response";
    console.error("[api/chat]", err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
