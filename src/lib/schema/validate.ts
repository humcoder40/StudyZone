import { z } from "zod";
import { getSubjectPack } from "./packs";

export type ValidatedQuestion = {
  packKey: string;
  type: string;
  subtype?: string | null;
  payload: unknown;
  answerKey: unknown;
  gradingDefault: "EXACT" | "AI" | "HYBRID";
  practiceEnabledByDefault: boolean;
};

/**
 * Book is derived via QuestionBank — never store a separate bookId on Question.
 * If unitId is set, the unit must belong to the same book as the bank.
 */
export function assertQuestionCatalogConsistency(input: {
  bankBookId: string;
  unitBookId?: string | null;
}): void {
  if (input.unitBookId != null && input.unitBookId !== input.bankBookId) {
    throw new Error(
      `Question unit is from book ${input.unitBookId} but bank belongs to book ${input.bankBookId}`,
    );
  }
}

/** Fields to copy onto AttemptAnswer when the student answers. */
export function questionAnswerSnapshot(question: {
  version: number;
  type: string;
  prompt: string;
  payload: unknown;
  answerKey: unknown;
  marks: number;
}) {
  return {
    questionVersion: question.version,
    typeSnapshot: question.type,
    promptSnapshot: question.prompt,
    payloadSnapshot: question.payload,
    answerKeySnapshot: question.answerKey,
    marksSnapshot: question.marks,
  };
}

/** Validate payload + answerKey against the subject's pack type definition. */
export function validateQuestionSpec(input: {
  packKey: string;
  type: string;
  subtype?: string | null;
  payload: unknown;
  answerKey: unknown;
}): ValidatedQuestion {
  const pack = getSubjectPack(input.packKey);
  const def = pack.types[input.type];
  if (!def) {
    throw new Error(
      `Pack "${input.packKey}" has no question type "${input.type}". Known: ${Object.keys(pack.types).join(", ")}`,
    );
  }

  const payload = def.payload.parse(input.payload);
  const answerKey = def.answerKey.parse(input.answerKey);

  return {
    packKey: input.packKey,
    type: input.type,
    subtype: input.subtype,
    payload,
    answerKey,
    gradingDefault: def.defaultGrading,
    practiceEnabledByDefault: def.practiceEnabledByDefault,
  };
}

/** Student response shapes by question type (English pack + shared). */
export const responseSchemas = {
  mcq: z.object({ selectedId: z.enum(["A", "B", "C", "D"]) }),
  short_answer: z.object({ text: z.string() }),
  translation: z.object({
    mode: z.enum(["translate", "simple_english"]).default("translate"),
    text: z.string().optional(),
    /** Asset ids for handwritten photo */
    assetIds: z.array(z.string()).optional(),
  }),
  poem_task: z.object({
    mode: z.enum(["summary", "paraphrase_rtc"]),
    text: z.string(),
  }),
  long_writing: z.object({
    topic: z.string(),
    text: z.string(),
  }),
  narration: z.object({ text: z.string() }),
  pair_of_words: z.object({
    sentence1: z.string(),
    sentence2: z.string(),
  }),
} as const;

export function validateResponse(type: string, response: unknown) {
  const schema = responseSchemas[type as keyof typeof responseSchemas];
  if (!schema) {
    // Unknown / future subject types: accept opaque JSON
    return z.record(z.string(), z.unknown()).parse(response);
  }
  return schema.parse(response);
}
