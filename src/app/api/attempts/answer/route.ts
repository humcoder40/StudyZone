import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { recordPracticeAnswer } from "@/lib/attempts";

export const runtime = "nodejs";

const bodySchema = z.object({
  questionId: z.string().min(1),
  response: z.record(z.string(), z.unknown()),
  attemptId: z.string().optional().nullable(),
  isCorrect: z.boolean().optional().nullable(),
  score: z.number().optional().nullable(),
  maxScore: z.number().optional().nullable(),
  feedback: z.string().optional().nullable(),
  gradeRaw: z.unknown().optional().nullable(),
  assetIds: z.array(z.string()).optional(),
  finalize: z
    .object({
      score: z.number(),
      maxScore: z.number(),
    })
    .optional()
    .nullable(),
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Log in to save your practice progress." },
        { status: 401 },
      );
    }

    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const body = parsed.data;
    const result = await recordPracticeAnswer({
      userId: session.user.id,
      questionId: body.questionId,
      response: body.response as Prisma.InputJsonValue,
      attemptId: body.attemptId,
      isCorrect: body.isCorrect,
      score: body.score,
      maxScore: body.maxScore,
      feedback: body.feedback,
      gradeRaw: (body.gradeRaw as Prisma.InputJsonValue | null) ?? null,
      assetIds: body.assetIds,
      finalize: body.finalize,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not save attempt";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
