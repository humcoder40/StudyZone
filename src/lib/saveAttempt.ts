/** Client helper: save one practice answer (returns null if logged out). */
export async function saveAttemptAnswer(input: {
  questionId: string;
  response: Record<string, unknown>;
  attemptId?: string | null;
  isCorrect?: boolean | null;
  score?: number | null;
  maxScore?: number | null;
  feedback?: string | null;
  gradeRaw?: unknown;
  assetIds?: string[];
  finalize?: { score: number; maxScore: number } | null;
}): Promise<{ attemptId: string } | null> {
  try {
    const res = await fetch("/api/attempts/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (res.status === 401) return null;
    const data = await res.json();
    if (!res.ok) {
      console.warn("saveAttemptAnswer failed:", data?.error ?? res.status);
      return null;
    }
    return { attemptId: data.attemptId as string };
  } catch (e) {
    console.warn("saveAttemptAnswer error:", e);
    return null;
  }
}
