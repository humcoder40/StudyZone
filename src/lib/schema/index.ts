export {
  subjectPacks,
  getSubjectPack,
  listQuestionTypes,
  englishPtb10Pack,
} from "./packs";
export type { PackKey, SubjectPack, QuestionTypeDef, GradingMode } from "./packs";
export {
  validateQuestionSpec,
  validateResponse,
  responseSchemas,
  assertQuestionCatalogConsistency,
  questionAnswerSnapshot,
} from "./validate";
export type { ValidatedQuestion } from "./validate";

/**
 * Board paper → schema mapping (English pack)
 *
 * Objective Q1–5   → type mcq, subtype "verb"
 * Objective Q6–9   → type mcq, subtype "spelling"
 * Objective Q10–14 → type mcq, subtype "vocab"
 * Objective Q15–19 → type mcq, subtype "grammar"
 * Q.2              → short_answer  (PaperSection chooseCount = 5)
 * Q.3 / Q.8        → translation
 * Q.4              → poem_task
 * Q.5              → long_writing (practiceEnabled = false)
 * Q.6              → narration
 * Q.7              → pair_of_words
 *
 * Other subjects: add packs/<subject>.ts + register in packs/index.ts.
 * No Prisma migration needed unless you add new *shared* columns.
 */
