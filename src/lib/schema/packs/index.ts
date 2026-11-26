import { englishPtb10Pack } from "./english_ptb_10";
import type { SubjectPack } from "./types";

/**
 * Registry of subject packs.
 * Add math_ptb_10 / physics_ptb_9 / etc. here — core Prisma tables stay unchanged.
 */
export const subjectPacks = {
  [englishPtb10Pack.packKey]: englishPtb10Pack,
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

export { englishPtb10Pack };
export type { SubjectPack, QuestionTypeDef, GradingMode } from "./types";
