import { z } from "zod";
import type { SubjectPack } from "./types";

const mcqOption = z.object({
  id: z.enum(["A", "B", "C", "D"]),
  text: z.string().min(1),
});

/** Objective Q1–19 style. subtype: verb | spelling | vocab | grammar */
const mcq = {
  type: "mcq",
  label: "Multiple choice",
  description: "Four-option MCQ (verb form, spelling, vocab, grammar).",
  defaultGrading: "EXACT" as const,
  practiceEnabledByDefault: true,
  payload: z.object({
    options: z.array(mcqOption).length(4),
    /** Optional underlined span inside prompt for grammar items */
    underline: z.string().optional(),
  }),
  answerKey: z.object({
    correctId: z.enum(["A", "B", "C", "D"]),
    explanation: z.string().optional(),
  }),
};

/** Board Q.2 — short textbook questions */
const shortAnswer = {
  type: "short_answer",
  label: "Short answer",
  description: "2–5 sentence textbook / comprehension answers.",
  defaultGrading: "AI" as const,
  practiceEnabledByDefault: true,
  payload: z.object({
    chapterHint: z.string().optional(),
    /** Soft length guidance for UI */
    expectedLines: z.number().int().positive().optional(),
  }),
  answerKey: z.object({
    modelAnswer: z.string().min(1),
    rubric: z.string().optional(),
  }),
};

/** Board Q.3 / Q.8 — translation + optional simple-English rewrite */
const translation = {
  type: "translation",
  label: "Translation",
  description: "Eng↔Urdu paragraph; en-ur may allow simple-English rewrite.",
  defaultGrading: "AI" as const,
  practiceEnabledByDefault: true,
  payload: z.object({
    direction: z.enum(["en-ur", "ur-en"]),
    source: z.string().min(1),
    title: z.string().optional(),
    notes: z.string().optional(),
    /** Board: translate to Urdu OR rewrite in simple English */
    allowSimpleEnglish: z.boolean().default(false),
    allowHandwritingPhoto: z.boolean().default(true),
  }),
  answerKey: z.object({
    modelAnswer: z.string().min(1),
    simpleEnglishModelAnswer: z.string().optional(),
  }),
};

/** Board Q.4 — poem summary OR paraphrase with reference to context */
const poemTask = {
  type: "poem_task",
  label: "Poem summary / paraphrase",
  description: "Summary of a named poem, or paraphrase lines + RTC.",
  defaultGrading: "AI" as const,
  practiceEnabledByDefault: true,
  payload: z.object({
    mode: z.enum(["summary", "paraphrase_rtc", "either"]),
    poemTitle: z.string().optional(),
    poet: z.string().optional(),
    lines: z.string().optional(),
    notes: z.string().optional(),
  }),
  answerKey: z.object({
    modelSummary: z.string().optional(),
    modelParaphrase: z.string().optional(),
    modelRtc: z.string().optional(),
  }),
};

/** Board Q.5 — stored for completeness; practiceEnabled false by default */
const longWriting = {
  type: "long_writing",
  label: "Essay / paragraph",
  description: "Long subjective writing (excluded from practice until ready).",
  defaultGrading: "AI" as const,
  practiceEnabledByDefault: false,
  payload: z.object({
    kind: z.enum(["essay", "paragraph"]),
    topics: z.array(z.string()).min(1),
    wordMin: z.number().int().positive().optional(),
    wordMax: z.number().int().positive().optional(),
  }),
  answerKey: z.object({
    modelOutlines: z.array(z.string()).optional(),
    rubric: z.string().optional(),
  }),
};

/** Board Q.6 — direct → indirect */
const narration = {
  type: "narration",
  label: "Direct / indirect speech",
  description: "Change sentence(s) into indirect (or reverse).",
  defaultGrading: "HYBRID" as const,
  practiceEnabledByDefault: true,
  payload: z.object({
    direction: z.enum(["direct_to_indirect", "indirect_to_direct"]).default(
      "direct_to_indirect",
    ),
    source: z.string().min(1),
  }),
  answerKey: z.object({
    modelAnswer: z.string().min(1),
    /** Acceptable variants for EXACT/HYBRID pre-check */
    accepted: z.array(z.string()).optional(),
  }),
};

/** Board Q.7 — pair of words in sentences */
const pairOfWords = {
  type: "pair_of_words",
  label: "Pair of words",
  description: "Use each word in a sentence to show meaning difference.",
  defaultGrading: "AI" as const,
  practiceEnabledByDefault: true,
  payload: z.object({
    word1: z.string().min(1),
    word2: z.string().min(1),
    tip: z.string().optional(),
  }),
  answerKey: z.object({
    modelSentences: z.tuple([z.string(), z.string()]),
  }),
};

/**
 * English Compulsory (PTB 10th) pack — Lahore Board style.
 * Other books in the same subject can reuse this pack; a different subject
 * registers its own packKey (e.g. math_ptb_10) with its own types.
 */
export const englishPtb10Pack = {
  packKey: "english_ptb_10",
  label: "English Compulsory · PTB Class 10",
  types: {
    mcq,
    short_answer: shortAnswer,
    translation,
    poem_task: poemTask,
    long_writing: longWriting,
    narration,
    pair_of_words: pairOfWords,
  },
} satisfies SubjectPack;

export type EnglishQuestionType = keyof typeof englishPtb10Pack.types;
