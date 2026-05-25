import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "OPENAI_API_KEY is not set. Add it to .env.local to enable voice transcription.",
      },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const audio = formData.get("audio");
  if (!(audio instanceof Blob)) {
    return NextResponse.json({ error: "Missing audio file" }, { status: 400 });
  }

  const whisperForm = new FormData();
  whisperForm.append("file", audio, "intro.webm");
  whisperForm.append("model", "whisper-1");
  whisperForm.append(
    "prompt",
    "Sales rep introducing themselves on a cold call or door knock."
  );

  try {
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: whisperForm,
    });

    const data = (await response.json()) as { text?: string; error?: { message?: string } };

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Whisper transcription failed" },
        { status: 502 }
      );
    }

    const text = data.text?.trim();
    if (!text) {
      return NextResponse.json(
        { error: "Empty transcription result" },
        { status: 502 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Transcription request failed";
    console.error("[api/transcribe]", error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
