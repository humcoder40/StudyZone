"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

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
  modelUsed?: string;
};

export function AiAnswerPanel({
  kind,
  prompt,
  modelAnswer,
  chapterHint,
  sourceText,
  urduSource,
  urduAnswer,
}: {
  kind: "short" | "translation" | "pairs";
  prompt: string;
  modelAnswer: string;
  chapterHint?: string;
  sourceText?: string;
  urduSource?: boolean;
  urduAnswer?: boolean;
}) {
  const reduce = useReducedMotion();
  const [answer, setAnswer] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function checkWithAi() {
    if (!answer.trim()) {
      setError("Write your answer first.");
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
          kind,
          prompt,
          studentAnswer: answer,
          modelAnswer,
          sourceText,
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

  return (
    <div className="rounded-3xl border border-line bg-card p-5 shadow-[var(--shadow)] backdrop-blur-md sm:p-6">
      <h3 className="text-lg font-semibold text-ink sm:text-xl">{prompt}</h3>
      {chapterHint && (
        <p className="mt-2 text-xs text-muted">Hint: {chapterHint}</p>
      )}
      {sourceText && (
        <div
          className={`mt-4 rounded-2xl bg-bg-deep/80 px-4 py-3 text-sm leading-relaxed text-ink ${
            urduSource ? "urdu text-base" : ""
          }`}
        >
          {sourceText}
        </div>
      )}

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={5}
        placeholder="Type your answer here…"
        className={`mt-4 w-full resize-y rounded-2xl border border-line bg-white/90 px-4 py-3 text-sm leading-relaxed text-ink outline-none ring-brand/30 placeholder:text-muted/70 focus:ring-2 ${
          urduAnswer ? "urdu text-base" : ""
        }`}
      />

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

      {error && (
        <p className="mt-3 text-sm font-medium text-bad">{error}</p>
      )}

      {showModel && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl bg-accent-soft px-4 py-3"
        >
          <p className="text-xs font-semibold tracking-wide text-ink/70 uppercase">
            Model answer
          </p>
          <p
            className={`mt-2 text-sm leading-relaxed text-ink ${
              /[\u0600-\u06FF]/.test(modelAnswer) ? "urdu text-base" : ""
            }`}
          >
            {modelAnswer}
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
          {result.spellingMistakes && result.spellingMistakes.length > 0 ? (
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
          )}

          {result.mechanicsMistakes && result.mechanicsMistakes.length > 0 ? (
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
                    {m.example ? (
                      <span className="block text-muted">e.g. {m.example}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-2 text-sm font-medium text-ok">
              Punctuation & capital letters look fine.
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
