"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { TranslationItem } from "@/data/exercises";

type Mode = "simple-english" | "urdu-photo";

type GradeResult = {
  score: number;
  maxScore: number;
  feedback: string;
  strengths?: string;
  missing?: string;
  spellingMistakes?: Array<{ wrong: string; correct: string }>;
  mechanicsMistakes?: Array<{
    type: string;
    issue: string;
    fix: string;
    example: string;
  }>;
  transcribedUrdu?: string;
  modelUsed?: string;
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image"));
    reader.readAsDataURL(file);
  });
}

export function EnToUrduPanel({ item }: { item: TranslationItem }) {
  const reduce = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<Mode>("simple-english");
  const [answer, setAnswer] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [showModel, setShowModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function switchMode(next: Mode) {
    setMode(next);
    setResult(null);
    setError(null);
    setShowModel(false);
  }

  async function onPickPhoto(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image (photo of your Urdu writing).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Image is too large (max 8 MB). Take a clearer, smaller photo.");
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setPhotoPreview(dataUrl);
    setPhotoName(file.name);
    setError(null);
    setResult(null);
  }

  async function checkWithAi() {
    if (mode === "simple-english" && !answer.trim()) {
      setError("Write your simple English rewrite first.");
      return;
    }
    if (mode === "urdu-photo" && !photoPreview) {
      setError("Upload a photo of your handwritten Urdu first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "translation",
          mode,
          prompt:
            mode === "simple-english"
              ? "Rewrite the paragraph into simple English (board option)."
              : "Grade handwritten Urdu translation from the uploaded photo.",
          studentAnswer:
            mode === "simple-english" ? answer : "(see uploaded Urdu photo)",
          modelAnswer:
            mode === "simple-english"
              ? item.simpleEnglishModelAnswer || item.modelAnswer
              : item.modelAnswer,
          sourceText: item.source,
          imageDataUrl: mode === "urdu-photo" ? photoPreview : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg =
          typeof data.error === "string"
            ? data.error
            : data.error?.message || "Grading failed";
        throw new Error(msg);
      }
      setResult(data as GradeResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not check with AI");
    } finally {
      setLoading(false);
    }
  }

  const modelForMode =
    mode === "simple-english"
      ? item.simpleEnglishModelAnswer || item.modelAnswer
      : item.modelAnswer;

  return (
    <div className="rounded-3xl border border-line bg-card p-5 shadow-[var(--shadow)] backdrop-blur-md sm:p-6">
      <h3
        className="text-xl text-ink sm:text-2xl"
        style={{ fontFamily: "var(--font-fraunces), serif" }}
      >
        {item.title}
      </h3>
      <p className="mt-2 text-xs text-muted">{item.notes}</p>

      <div className="mt-4 rounded-2xl bg-bg-deep/80 px-4 py-3 text-sm leading-relaxed text-ink">
        {item.source}
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => switchMode("simple-english")}
          className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
            mode === "simple-english"
              ? "border-brand bg-brand-soft text-ink"
              : "border-line bg-white/80 text-muted hover:text-ink"
          }`}
        >
          Option A · Rewrite in simple English
          <span className="mt-1 block text-xs font-normal opacity-80">
            Type on laptop — like the exam alternate
          </span>
        </button>
        <button
          type="button"
          onClick={() => switchMode("urdu-photo")}
          className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
            mode === "urdu-photo"
              ? "border-brand bg-brand-soft text-ink"
              : "border-line bg-white/80 text-muted hover:text-ink"
          }`}
        >
          Option B · Upload Urdu photo
          <span className="mt-1 block text-xs font-normal opacity-80">
            Handwrite Urdu, snap a pic — no typing needed
          </span>
        </button>
      </div>

      {mode === "simple-english" ? (
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={5}
          placeholder="Rewrite the paragraph in simple English…"
          className="mt-4 w-full resize-y rounded-2xl border border-line bg-white/90 px-4 py-3 text-sm leading-relaxed text-ink outline-none ring-brand/30 placeholder:text-muted/70 focus:ring-2"
        />
      ) : (
        <div className="mt-4">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => onPickPhoto(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full rounded-2xl border border-dashed border-brand/40 bg-brand-soft/50 px-4 py-8 text-center text-sm font-semibold text-ink hover:bg-brand-soft"
          >
            {photoName
              ? `Change photo (${photoName})`
              : "Upload / take photo of your Urdu translation"}
          </button>
          {photoPreview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoPreview}
              alt="Uploaded Urdu translation"
              className="mt-3 max-h-80 w-full rounded-2xl border border-line object-contain bg-white"
            />
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowModel((v) => !v)}
          className="rounded-2xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink"
        >
          {showModel ? "Hide model answer" : "Show model answer"}
        </button>
        <button
          type="button"
          onClick={checkWithAi}
          disabled={loading}
          className="rounded-2xl bg-brand px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Checking…" : "Check with AI"}
        </button>
      </div>

      {error && <p className="mt-3 text-sm font-medium text-bad">{error}</p>}

      {showModel && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl bg-accent-soft px-4 py-3"
        >
          <p className="text-xs font-semibold tracking-wide text-ink/70 uppercase">
            Model answer (
            {mode === "simple-english" ? "simple English" : "Urdu"})
          </p>
          <p
            className={`mt-2 text-sm leading-relaxed text-ink ${
              mode === "urdu-photo" ? "urdu text-base" : ""
            }`}
          >
            {modelForMode}
          </p>
        </motion.div>
      )}

      {result && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl bg-brand-soft px-4 py-3"
        >
          <p className="text-sm font-semibold text-brand">
            AI score: {result.score}/{result.maxScore}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink">{result.feedback}</p>
          {result.transcribedUrdu && (
            <div className="mt-3 rounded-xl bg-white/70 px-3 py-2">
              <p className="text-xs font-semibold text-muted uppercase">
                AI read from your photo
              </p>
              <p className="urdu mt-1 text-base text-ink">{result.transcribedUrdu}</p>
            </div>
          )}
          {result.strengths && (
            <p className="mt-2 text-sm text-ink/80">
              <strong>Good:</strong> {result.strengths}
            </p>
          )}
          {result.missing && (
            <p className="mt-1 text-sm text-ink/80">
              <strong>Improve:</strong> {result.missing}
            </p>
          )}
          {mode === "simple-english" &&
            (result.spellingMistakes && result.spellingMistakes.length > 0 ? (
              <div className="mt-3 rounded-xl bg-bad-soft px-3 py-2">
                <p className="text-xs font-semibold tracking-wide text-bad uppercase">
                  Spelling to fix
                </p>
                <ul className="mt-1 space-y-1 text-sm text-ink">
                  {result.spellingMistakes.map((m, i) => (
                    <li key={`${m.wrong}-${i}`}>
                      <span className="line-through opacity-70">{m.wrong}</span>
                      {m.correct ? (
                        <>
                          {" → "}
                          <strong>{m.correct}</strong>
                        </>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-3 text-sm font-medium text-ok">
                Spelling looks clean.
              </p>
            ))}
          {mode === "simple-english" &&
            (result.mechanicsMistakes && result.mechanicsMistakes.length > 0 ? (
              <div className="mt-3 rounded-xl bg-accent-soft px-3 py-2">
                <p className="text-xs font-semibold tracking-wide text-ink/70 uppercase">
                  Punctuation & capitals
                </p>
                <ul className="mt-1 space-y-2 text-sm text-ink">
                  {result.mechanicsMistakes.map((m, i) => (
                    <li key={`${m.type}-${i}`}>
                      <span className="font-semibold capitalize">
                        {(m.type || "issue").replaceAll("_", " ")}:
                      </span>{" "}
                      {m.issue}
                      {m.fix ? (
                        <span className="block text-ink/80">Fix: {m.fix}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-2 text-sm font-medium text-ok">
                Punctuation & capital letters look fine.
              </p>
            ))}
        </motion.div>
      )}
    </div>
  );
}
