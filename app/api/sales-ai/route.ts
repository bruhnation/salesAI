import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

type AdvisorTurn = { role: "user" | "ai"; text: string };

function getModelName() {
  return process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";
}

function buildAdvisorPrompt(question: string, history: AdvisorTurn[]) {
  const transcript =
    history.length > 0
      ? `\nPrior conversation:\n${history
          .map((turn) =>
            turn.role === "user"
              ? `Seller: ${turn.text}`
              : `Sales AI: ${turn.text}`
          )
          .join("\n\n")}\n`
      : "";

  return `You are Sales AI, a concise, tactical sales coach.

Give practical advice a seller can use immediately. Be specific, direct, and brief.
If the user asks for objection handling, give a suggested response and explain the strategy in one sentence.
If they ask about a deal, help them identify the buyer concern, next question, and next action.
Do not roleplay as a prospect in this endpoint.
${transcript}
Seller question:
"""${question}"""`;
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

  const { question, history } = body as Record<string, unknown>;
  const questionText = typeof question === "string" ? question.trim() : "";

  if (!questionText) {
    return NextResponse.json(
      { error: "Field 'question' is required" },
      { status: 400 }
    );
  }

  const priorTurns: AdvisorTurn[] = [];
  if (Array.isArray(history)) {
    for (const item of history) {
      if (!item || typeof item !== "object") continue;
      const rec = item as Record<string, unknown>;
      if (
        (rec.role === "user" || rec.role === "ai") &&
        typeof rec.text === "string" &&
        rec.text.trim()
      ) {
        priorTurns.push({ role: rec.role, text: rec.text.trim() });
      }
    }
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: getModelName() });
    const result = await model.generateContent(
      buildAdvisorPrompt(questionText, priorTurns)
    );
    const message = result.response.text().trim();

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
    console.error("[api/sales-ai]", err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
