import type { Prisma } from "@prisma/client";
import {
  CHAPTER_CONTEXT as FALLBACK_CHAPTER_CONTEXT,
  type McqOption,
  type McqSet,
  type PairItem,
  type ShortQuestion,
  type TranslationItem,
} from "@/data/exercises";
import { prisma } from "@/lib/db";

export const PRACTICE_BOOK_SLUG = "10th-english-new";
export const PRACTICE_BANK_SLUG = "unit1-practice";

type QuestionRow = {
  id: string;
  type: string;
  subtype: string | null;
  prompt: string;
  payload: Prisma.JsonValue;
  answerKey: Prisma.JsonValue;
  meta: Prisma.JsonValue;
  sortOrder: number;
};

function asRecord(value: Prisma.JsonValue): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

async function loadBankQuestions(): Promise<QuestionRow[]> {
  const bank = await prisma.questionBank.findFirst({
    where: {
      slug: PRACTICE_BANK_SLUG,
      book: { slug: PRACTICE_BOOK_SLUG },
    },
    include: {
      questions: {
        where: { practiceEnabled: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!bank) {
    throw new Error(
      `Practice bank "${PRACTICE_BANK_SLUG}" not found. Run npm run db:seed.`,
    );
  }

  return bank.questions;
}

/** Unit 1 chapter context for Gemini grading (from DB summary when present). */
export async function getChapterContext(): Promise<string> {
  const unit = await prisma.unit.findFirst({
    where: {
      number: 1,
      book: { slug: PRACTICE_BOOK_SLUG },
    },
    select: { summary: true },
  });
  const summary = unit?.summary?.trim();
  return summary || FALLBACK_CHAPTER_CONTEXT;
}

export async function getMcqSets(): Promise<McqSet[]> {
  const questions = (await loadBankQuestions()).filter((q) => q.type === "mcq");
  const groups = new Map<
    string,
    { title: string; subtitle: string; questions: McqSet["questions"] }
  >();

  for (const q of questions) {
    const meta = asRecord(q.meta);
    const payload = asRecord(q.payload);
    const answerKey = asRecord(q.answerKey);
    const setId = typeof meta.setId === "string" ? meta.setId : "set-1";
    const setTitle =
      typeof meta.setTitle === "string" ? meta.setTitle : "Quiz Set";
    const options = (payload.options as McqOption[] | undefined) ?? [];
    const correctId = answerKey.correctId as McqOption["id"];
    const explanation =
      typeof answerKey.explanation === "string" ? answerKey.explanation : "";

    if (!groups.has(setId)) {
      groups.set(setId, {
        title: setTitle,
        subtitle: "From StudyZone database",
        questions: [],
      });
    }

    groups.get(setId)!.questions.push({
      id: q.id,
      section: (q.subtype as McqSet["questions"][number]["section"]) || "grammar",
      prompt: q.prompt,
      options,
      correctId,
      explanation,
    });
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, g]) => ({
      id,
      title: g.title,
      subtitle: g.subtitle,
      questions: g.questions,
    }));
}

export async function getMcqSet(setId: string): Promise<McqSet | null> {
  const sets = await getMcqSets();
  return sets.find((s) => s.id === setId) ?? null;
}

export async function getShortQuestions(): Promise<ShortQuestion[]> {
  const questions = (await loadBankQuestions()).filter(
    (q) => q.type === "short_answer",
  );
  return questions.map((q) => {
    const payload = asRecord(q.payload);
    const answerKey = asRecord(q.answerKey);
    return {
      id: q.id,
      prompt: q.prompt,
      modelAnswer: String(answerKey.modelAnswer ?? ""),
      chapterHint:
        typeof payload.chapterHint === "string" ? payload.chapterHint : "",
    };
  });
}

export async function getTranslations(): Promise<TranslationItem[]> {
  const questions = (await loadBankQuestions()).filter(
    (q) => q.type === "translation",
  );
  return questions.map((q) => {
    const payload = asRecord(q.payload);
    const answerKey = asRecord(q.answerKey);
    return {
      id: q.id,
      direction: (payload.direction as TranslationItem["direction"]) || "en-ur",
      title:
        typeof payload.title === "string" ? payload.title : q.prompt,
      source: String(payload.source ?? ""),
      modelAnswer: String(answerKey.modelAnswer ?? ""),
      simpleEnglishModelAnswer:
        typeof answerKey.simpleEnglishModelAnswer === "string"
          ? answerKey.simpleEnglishModelAnswer
          : undefined,
      notes: typeof payload.notes === "string" ? payload.notes : "",
    };
  });
}

export async function getPairs(): Promise<PairItem[]> {
  const questions = (await loadBankQuestions()).filter(
    (q) => q.type === "pair_of_words",
  );
  return questions.map((q) => {
    const payload = asRecord(q.payload);
    const answerKey = asRecord(q.answerKey);
    const sentences = answerKey.modelSentences as [string, string] | undefined;
    return {
      id: q.id,
      word1: String(payload.word1 ?? ""),
      word2: String(payload.word2 ?? ""),
      modelSentences: sentences ?? ["", ""],
      tip: typeof payload.tip === "string" ? payload.tip : "",
    };
  });
}

export async function getPracticeCounts() {
  const [mcqSets, shortQuestions, translations, pairs] = await Promise.all([
    getMcqSets(),
    getShortQuestions(),
    getTranslations(),
    getPairs(),
  ]);
  return {
    mcqSets: mcqSets.length,
    mcqQuestions: mcqSets.reduce((n, s) => n + s.questions.length, 0),
    shortQuestions: shortQuestions.length,
    translations: translations.length,
    pairs: pairs.length,
    firstMcqSetId: mcqSets[0]?.id ?? "set-1",
  };
}

/** Book/unit ids for XP clear + path UI */
export async function getEnglish10PracticeMeta() {
  const book = await prisma.book.findUnique({
    where: { slug: PRACTICE_BOOK_SLUG },
    select: {
      id: true,
      slug: true,
      title: true,
      units: {
        orderBy: { number: "asc" },
        select: { id: true, number: true, title: true },
      },
    },
  });
  if (!book) return null;
  const unit1 = book.units.find((u) => u.number === 1) ?? book.units[0];
  return { book, unit1 };
}

export async function getQuizRunQuestions(limit = 10) {
  const questions = (await loadBankQuestions()).filter((q) => q.type === "mcq");
  const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, limit);
  return shuffled.map((q) => {
    const payload = asRecord(q.payload);
    const answerKey = asRecord(q.answerKey);
    return {
      id: q.id,
      prompt: q.prompt,
      section: (q.subtype as string) || "grammar",
      options: (payload.options as McqOption[]) ?? [],
      correctId: answerKey.correctId as McqOption["id"],
      explanation:
        typeof answerKey.explanation === "string" ? answerKey.explanation : "",
    };
  });
}

/** Full Unit 1 English adventure payload (real seeded exercises). */
export async function getUnit1Adventure() {
  const [sets, meta, pairs, shorts] = await Promise.all([
    getMcqSets(),
    getEnglish10PracticeMeta(),
    getPairs(),
    getShortQuestions(),
  ]);
  return {
    chapterTitle:
      meta?.unit1?.title ??
      "Hazrat Muhammad's (SAW) Social Reforms for the Rights of Women, Orphans and Slaves",
    bookId: meta?.book.id ?? null,
    unitId: meta?.unit1?.id ?? null,
    mcqSets: sets,
    pairCount: pairs.length,
    shortCount: shorts.length,
    pairPreview: pairs.slice(0, 3).map((p) => ({
      id: p.id,
      word1: p.word1,
      word2: p.word2,
      tip: p.tip,
      modelSentences: p.modelSentences,
    })),
  };
}

export async function getMath10McqSet() {
  const bank = await prisma.questionBank.findFirst({
    where: {
      slug: "unit1-math-practice",
      book: { slug: "10th-math-thin" },
    },
    include: {
      questions: {
        where: { practiceEnabled: true, type: "mcq" },
        orderBy: { sortOrder: "asc" },
      },
      book: { select: { id: true } },
    },
  });
  if (!bank) return null;
  const questions = bank.questions.map((q) => {
    const payload = asRecord(q.payload);
    const answerKey = asRecord(q.answerKey);
    return {
      id: q.id,
      section: (q.subtype as McqSet["questions"][number]["section"]) || "grammar",
      prompt: q.prompt,
      options: (payload.options as McqOption[]) ?? [],
      correctId: answerKey.correctId as McqOption["id"],
      explanation:
        typeof answerKey.explanation === "string" ? answerKey.explanation : "",
    };
  });
  return {
    id: "math-set-1",
    title: "Class 10 Math · Unit 1 drills",
    subtitle: "Quadratic & number basics",
    questions,
    bookId: bank.book.id,
    unitId: bank.questions[0]?.unitId ?? null,
  };
}
