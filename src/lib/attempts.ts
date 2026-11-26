import type { Prisma } from "@prisma/client";
import { AttemptStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { questionAnswerSnapshot } from "@/lib/schema";

export async function recordPracticeAnswer(input: {
  userId: string;
  questionId: string;
  response: Prisma.InputJsonValue;
  attemptId?: string | null;
  isCorrect?: boolean | null;
  score?: number | null;
  maxScore?: number | null;
  feedback?: string | null;
  gradeRaw?: Prisma.InputJsonValue | null;
  assetIds?: string[];
  /** When true, mark the attempt graded and store totals if provided */
  finalize?: {
    score: number;
    maxScore: number;
  } | null;
}) {
  const question = await prisma.question.findUnique({
    where: { id: input.questionId },
    select: {
      id: true,
      bankId: true,
      version: true,
      type: true,
      prompt: true,
      payload: true,
      answerKey: true,
      marks: true,
    },
  });

  if (!question) {
    throw new Error("Question not found");
  }

  let attemptId = input.attemptId ?? null;

  if (attemptId) {
    const existing = await prisma.attempt.findFirst({
      where: { id: attemptId, userId: input.userId },
      select: { id: true },
    });
    if (!existing) attemptId = null;
  }

  if (!attemptId) {
    const attempt = await prisma.attempt.create({
      data: {
        userId: input.userId,
        bankId: question.bankId,
        status: AttemptStatus.IN_PROGRESS,
        meta: { source: "practice" },
      },
      select: { id: true },
    });
    attemptId = attempt.id;
  }

  const snap = questionAnswerSnapshot({
    version: question.version,
    type: question.type,
    prompt: question.prompt,
    payload: question.payload,
    answerKey: question.answerKey,
    marks: question.marks,
  });

  const answer = await prisma.attemptAnswer.upsert({
    where: {
      attemptId_questionId: {
        attemptId,
        questionId: question.id,
      },
    },
    create: {
      attemptId,
      questionId: question.id,
      response: input.response,
      assetIds: input.assetIds ?? [],
      isCorrect: input.isCorrect ?? null,
      score: input.score ?? null,
      maxScore: input.maxScore ?? null,
      feedback: input.feedback ?? null,
      gradeRaw: input.gradeRaw ?? undefined,
      gradedAt: new Date(),
      ...snap,
      payloadSnapshot: snap.payloadSnapshot as Prisma.InputJsonValue,
      answerKeySnapshot: snap.answerKeySnapshot as Prisma.InputJsonValue,
    },
    update: {
      response: input.response,
      assetIds: input.assetIds ?? [],
      isCorrect: input.isCorrect ?? null,
      score: input.score ?? null,
      maxScore: input.maxScore ?? null,
      feedback: input.feedback ?? null,
      gradeRaw: input.gradeRaw ?? undefined,
      gradedAt: new Date(),
      ...snap,
      payloadSnapshot: snap.payloadSnapshot as Prisma.InputJsonValue,
      answerKeySnapshot: snap.answerKeySnapshot as Prisma.InputJsonValue,
    },
    select: { id: true },
  });

  if (input.finalize) {
    await prisma.attempt.update({
      where: { id: attemptId },
      data: {
        status: AttemptStatus.GRADED,
        submittedAt: new Date(),
        score: input.finalize.score,
        maxScore: input.finalize.maxScore,
      },
    });
  }

  return { attemptId, answerId: answer.id };
}
