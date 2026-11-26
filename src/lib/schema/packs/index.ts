import { englishPtb10Pack } from "./english_ptb_10";
import { mathPtb10Pack } from "./math_ptb_10";
import type { SubjectPack } from "./types";

/**
 * Registry of subject packs.
 * Core Prisma tables stay unchanged when adding packs.
 */
export const subjectPacks = {
  [englishPtb10Pack.packKey]: englishPtb10Pack,
  [mathPtb10Pack.packKey]: mathPtb10Pack,
} as const satisfies Record<string, SubjectPack>;

export type PackKey = keyof typeof subjectPacks;

export function getSubjectPack(packKey: string): SubjectPack {
  const pack = subjectPacks[packKey as PackKey];
  if (!pack) {
    throw new Error(
      `Unknown subject pack "${packKey}". Register it in src/lib/schema/packs.`,
    );
  }
  return pack;
}

export function listQuestionTypes(packKey: string): string[] {
  return Object.keys(getSubjectPack(packKey).types);
}

export { englishPtb10Pack, mathPtb10Pack };
export type { SubjectPack, QuestionTypeDef, GradingMode } from "./types";
