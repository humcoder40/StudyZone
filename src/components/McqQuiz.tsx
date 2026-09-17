"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { McqSet } from "@/data/exercises";
import Link from "next/link";

const sectionLabel: Record<string, string> = {
  verb: "Correct form of verb",
  spelling: "Correct spelling",
  vocab: "Synonym / Antonym / Meaning",
  grammar: "Grammar",
};

export function McqQuiz({ set }: { set: McqSet }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<Record<string, string>>({});
  const q = set.questions[index];
  const answered = picked[q.id];
  const isCorrect = answered === q.correctId;

  const score = useMemo(() => {
    return set.questions.reduce((acc, question) => {
      if (picked[question.id] === question.correctId) return acc + 1;
      return acc;
    }, 0);
  }, [picked, set.questions]);

  const done = Object.keys(picked).length === set.questions.length;

  function choose(optionId: string) {
    if (picked[q.id]) return;
    setPicked((prev) => ({ ...prev, [q.id]: optionId }));
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{set.subtitle}</p>
          <p className="mt-1 text-sm font-medium text-ink">
            Question {index + 1} / {set.questions.length}
          </p>
        </div>
        <div className="rounded-2xl bg-accent-soft px-4 py-2 text-sm font-semibold text-ink">
          Score {score}/{set.questions.length}
        </div>
      </div>

      <div className="mb-4 h-2 overflow-hidden rounded-full bg-bg-deep">
        <motion.div
          className="h-full rounded-full bg-brand"
          animate={{
            width: `${((index + (answered ? 1 : 0)) / set.questions.length) * 100}%`,
          }}
          transition={{ duration: reduce ? 0 : 0.35 }}
        />
      </div>

      <div className="mb-4 flex gap-2">
        {(["set-1", "set-2", "set-3"] as const).map((id) => (
          <Link
            key={id}
            href={`/practice/mcq/${id}`}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${
              set.id === id
                ? "bg-brand text-white"
                : "bg-white/70 text-muted hover:text-ink"
            }`}
          >
            {id.replace("set-", "Set ")}
          </Link>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={reduce ? false : { opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? undefined : { opacity: 0, x: -18 }}
          transition={{ duration: 0.28 }}
          className="rounded-3xl border border-line bg-card p-6 shadow-[var(--shadow)] backdrop-blur-md"
        >
          <p className="text-xs font-semibold tracking-wide text-brand uppercase">
            {sectionLabel[q.section]}
          </p>
          <h2 className="mt-3 text-xl leading-snug text-ink sm:text-2xl">{q.prompt}</h2>

          <div className="mt-6 grid gap-3">
            {q.options.map((opt) => {
              const selected = answered === opt.id;
              const showCorrect = answered && opt.id === q.correctId;
              const showWrong = selected && !isCorrect;

              let styles =
                "border-line bg-white/80 hover:border-brand/40 hover:bg-brand-soft/40";
              if (showCorrect) styles = "border-ok bg-ok-soft";
              if (showWrong) styles = "border-bad bg-bad-soft";

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => choose(opt.id)}
                  disabled={Boolean(answered)}
                  className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${styles} ${
                    answered ? "cursor-default" : "cursor-pointer"
                  }`}
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-bg-deep text-sm font-bold">
                    {opt.id}
                  </span>
                  <span className="text-[15px] leading-relaxed text-ink">{opt.text}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {answered && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-5 rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isCorrect ? "bg-ok-soft text-ok" : "bg-bad-soft text-bad"
                }`}
              >
                <p className="font-semibold">
                  {isCorrect ? "Correct!" : `Not quite — answer is ${q.correctId}.`}
                </p>
                <p className="mt-1 opacity-90">{q.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="rounded-2xl border border-line bg-white/80 px-4 py-2.5 text-sm font-semibold disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={!answered || index === set.questions.length - 1}
          onClick={() => setIndex((i) => Math.min(set.questions.length - 1, i + 1))}
          className="rounded-2xl bg-brand px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {done && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-3xl border border-brand/20 bg-brand-soft p-5"
        >
          <p
            className="text-2xl text-ink"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            Set complete — {score}/10
          </p>
          <p className="mt-2 text-sm text-muted">
            Review any question with Previous, or try another set above.
          </p>
        </motion.div>
      )}
    </div>
  );
}
