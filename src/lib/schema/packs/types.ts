import type { z } from "zod";

/** Shared grading modes (mirrors Prisma GradingMode). */
export type GradingMode = "EXACT" | "AI" | "HYBRID";

export type QuestionTypeDef<TPayload extends z.ZodType, TAnswer extends z.ZodType> = {
  type: string;
  label: string;
  description: string;
  defaultGrading: GradingMode;
  /** Board essay/paragraph etc. — storeable but off by default in practice UI */
  practiceEnabledByDefault: boolean;
  payload: TPayload;
  answerKey: TAnswer;
};

export type SubjectPack = {
  packKey: string;
  label: string;
  /** Question types this subject understands */
  types: Record<string, QuestionTypeDef<z.ZodType, z.ZodType>>;
};
