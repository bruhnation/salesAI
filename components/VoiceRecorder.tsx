"use client";

import { Mic, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type VoiceRecorderProps = {
  onTranscript: (text: string) => void;
  onError?: (message: string) => void;
};

type RecorderState = "idle" | "recording" | "recorded" | "uploading";

export function VoiceRecorder({ onTranscript, onError }: VoiceRecorderProps) {
  const [state, setState] = useState<RecorderState>("idle");
  const [seconds, setSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [levels, setLevels] = useState<number[]>(Array(16).fill(0.15));

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    return () => {
      stopTracks();
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function stopTracks() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setState("recorded");
        stopTracks();
        if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      };

      recorder.start();
      setState("recording");
      setSeconds(0);

      timerRef.current = window.setInterval(() => {
        setSeconds((current) => {
          if (current + 1 >= 60) {
            stopRecording();
            return 60;
          }
          return current + 1;
        });
      }, 1000);

      const draw = () => {
        if (!analyserRef.current) return;
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);
        const next = Array.from({ length: 16 }, (_, index) => {
          const value = data[index] ?? 0;
          return Math.max(0.12, value / 255);
        });
        setLevels(next);
        rafRef.current = window.requestAnimationFrame(draw);
      };
      draw();
    } catch {
      onError?.("Microphone access is required for voice onboarding.");
    }
  }

  function stopRecording() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }

  async function submitRecording() {
    if (!audioBlob) return;
    setState("uploading");

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "intro.webm");

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { text?: string; error?: string };

      if (!response.ok || !data.text?.trim()) {
        throw new Error(data.error || "Could not transcribe your intro.");
      }

      onTranscript(data.text.trim());
    } catch (error) {
      setState("recorded");
      onError?.(
        error instanceof Error ? error.message : "Transcription failed."
      );
    }
  }

  function resetRecording() {
    setAudioBlob(null);
    setSeconds(0);
    setState("idle");
    setLevels(Array(16).fill(0.15));
  }

  return (
    <div className="flex flex-col items-center">
      {state === "recording" && (
        <div className="mb-6 flex h-10 items-end gap-1">
          {levels.map((level, index) => (
            <div
              key={index}
              className="w-2 rounded-full bg-accent transition-all duration-75"
              style={{ height: `${Math.max(12, level * 40)}px` }}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          if (state === "idle") void startRecording();
          else if (state === "recording") stopRecording();
        }}
        disabled={state === "uploading" || state === "recorded"}
        className={`relative flex h-[120px] w-[120px] items-center justify-center rounded-full transition-all ${
          state === "recording"
            ? "bg-accent/20 ring-4 ring-accent/40 animate-pulse"
            : "bg-accent text-zinc-950 hover:brightness-110"
        }`}
        aria-label={state === "recording" ? "Stop recording" : "Start recording"}
      >
        {state === "recording" ? (
          <Square className="h-10 w-10 fill-current text-accent" />
        ) : (
          <Mic className="h-12 w-12" />
        )}
      </button>

      <p className="mt-4 text-sm text-muted">
        {state === "idle" && "Tap to record"}
        {state === "recording" && `Recording ${seconds}s / 60s`}
        {state === "recorded" && "Recording saved"}
        {state === "uploading" && "Transcribing..."}
      </p>

      {state === "recorded" && (
        <div className="mt-8 flex w-full max-w-sm gap-3">
          <button
            type="button"
            onClick={resetRecording}
            className="flex-1 rounded-full border border-border px-4 py-3 text-sm font-semibold text-white"
          >
            Re-record
          </button>
          <button
            type="button"
            onClick={() => void submitRecording()}
            className="flex-1 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-zinc-950"
          >
            Looks good →
          </button>
        </div>
      )}
    </div>
  );
}
