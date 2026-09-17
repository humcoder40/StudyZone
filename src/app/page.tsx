"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const modules = [
  {
    href: "/practice/mcq/set-1",
    eyebrow: "Objective · 3 sets",
    title: "MCQ Quizzes",
    blurb: "Grammar, spelling, synonyms & antonyms — tap an option and learn instantly.",
    meta: "30 questions",
    tone: "from-[#0f6b4c] to-[#1a8f66]",
  },
  {
    href: "/practice/short",
    eyebrow: "Subjective",
    title: "Short Questions",
    blurb: "Unit 1 social reforms. Model answers + optional Gemini check.",
    meta: "6 questions",
    tone: "from-[#1f5b8a] to-[#2f7ab0]",
  },
  {
    href: "/practice/translation",
    eyebrow: "Board style",
    title: "Translation",
    blurb: "Board style: simple English rewrite OR upload handwritten Urdu photo.",
    meta: "2 passages",
    tone: "from-[#b45309] to-[#d97706]",
  },
  {
    href: "/practice/pairs",
    eyebrow: "Vocabulary",
    title: "Pair of Words",
    blurb: "Use confusing pairs in your own sentences — then compare.",
    meta: "5 pairs",
    tone: "from-[#0f4c5c] to-[#1a6b7a]",
  },
];

export default function HomePage() {
  const reduce = useReducedMotion();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-10 sm:px-8 sm:py-14">
      <motion.header
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12 max-w-3xl"
      >
        <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-brand uppercase">
          StudyZone
        </p>
        <h1
          className="text-4xl leading-[1.05] text-ink sm:text-6xl"
          style={{ fontFamily: "var(--font-fraunces), serif" }}
        >
          Class 10 English
          <span className="block text-brand">practice that teaches back.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Board-style exercises for{" "}
          <strong className="font-semibold text-ink">
            Unit 1 — Social Reforms
          </strong>
          . Click, learn why, and check written answers with AI when you want.
        </p>
      </motion.header>

      <div className="grid gap-4 sm:grid-cols-2">
        {modules.map((mod, i) => (
          <motion.div
            key={mod.href}
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={mod.href}
              className="group relative block overflow-hidden rounded-3xl border border-line bg-card p-6 shadow-[var(--shadow)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1"
            >
              <div
                className={`mb-8 h-1.5 w-16 rounded-full bg-gradient-to-r ${mod.tone}`}
              />
              <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                {mod.eyebrow}
              </p>
              <h2
                className="mt-2 text-2xl text-ink"
                style={{ fontFamily: "var(--font-fraunces), serif" }}
              >
                {mod.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{mod.blurb}</p>
              <div className="mt-8 flex items-center justify-between">
                <span className="text-sm font-medium text-brand">{mod.meta}</span>
                <span className="text-sm font-semibold text-ink transition-transform group-hover:translate-x-1">
                  Open →
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.section
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mt-10 rounded-3xl border border-line bg-brand-soft/70 px-6 py-5"
      >
        <p className="text-sm leading-relaxed text-ink/80">
          <strong>Tip:</strong> MCQs give instant feedback. For short answers,
          translation, and pairs — use <em>Show model answer</em> anytime, or{" "}
          <em>Check with AI</em> for Gemini feedback against the chapter.
        </p>
      </motion.section>
    </main>
  );
}
