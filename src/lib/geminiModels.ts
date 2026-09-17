/**
 * StudyZone Gemini model config — aligned with Google AI Studio free-tier quotas.
 *
 * IMPORTANT:
 * - High-volume models (500 / 14.4K RPD) are used for automated grading & OCR fallback.
 * - Flagship Flash models (~20 RPD) are NOT in the auto chain (they exhaust instantly).
 * - Live / embedding / agent IDs are exported for later features, not for Check-with-AI loops.
 *
 * Actual API IDs on this project (aliases included where Studio names differ):
 * - gemma-4-31b  → often `gemma-4-31b-it`
 * - gemma-4-26b  → often `gemma-4-26b-a4b-it`
 */

/** Primary automated chain: best practical free model → next (high RPD). */
export const GEMINI_MODEL_CHAIN = [
  // §1 High-volume Flash Lite (500 RPD)
  "gemini-3.1-flash-lite",
  "gemini-3.1-flash-lite-preview",
  "gemini-3.5-flash-lite",
  // §2 Cloud-hosted Gemma (14.4K RPD) — safety net
  "gemma-4-31b-it",
  "gemma-4-31b",
  "gemma-4-26b-a4b-it",
  "gemma-4-26b",
  // §4 Agent model
  "antigravity",
  // §6 Flagships (~20 RPD) — last resort only if high-tier is exhausted
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-flash-latest",
] as const;

/**
 * Vision / OCR chain — multimodal Flash Lite only.
 * Gemma & antigravity are text-oriented; keep them out of page-image OCR.
 */
export const GEMINI_VISION_MODEL_CHAIN = [
  "gemini-3.1-flash-lite",
  "gemini-3.1-flash-lite-preview",
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest",
  // Last resort (~20 RPD) if Lite quotas are gone
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-flash-latest",
] as const;

/** §3 Embeddings — for future RAG / vector search (not grading). */
export const GEMINI_EMBEDDING_MODELS = [
  "gemini-embedding-1",
  "gemini-embedding-2",
] as const;

/** §5 Live / streaming — future voice features (not REST grading). */
export const GEMINI_LIVE_MODELS = [
  "gemini-2.5-flash-native-audio-dialog",
  "gemini-3-flash-live",
  "gemini-3.5-live-translate",
  "gemini-3.5-transcribe-live",
  "gemini-3.8-live",
  "gemini-3.8-live-extended-thinking",
] as const;

/**
 * §6 Low-capacity flagships (~20 RPD) — DO NOT auto-fallback here.
 * Kept only so a manual GEMINI_MODEL= override can still target them.
 */
export const GEMINI_FLAGSHIP_MODELS_LOW_RPD = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
] as const;

export type GeminiModelId = (typeof GEMINI_MODEL_CHAIN)[number];

export const GEMINI_MODEL_ALIASES: Record<string, string[]> = {
  "gemma-4-31b": ["gemma-4-31b-it"],
  "gemma-4-26b": ["gemma-4-26b-a4b-it"],
  "gemini-3.0-flash": ["gemini-3-flash-preview"],
  "gemini-3-flash": ["gemini-3-flash-preview"],
};

export function expandModelChain(
  preferred?: string | null,
  opts?: { vision?: boolean },
): string[] {
  const base = opts?.vision ? GEMINI_VISION_MODEL_CHAIN : GEMINI_MODEL_CHAIN;
  const chain: string[] = [];
  const push = (id: string) => {
    if (id && !chain.includes(id)) chain.push(id);
  };

  if (preferred?.trim()) {
    const p = preferred.trim();
    push(p);
    for (const alias of GEMINI_MODEL_ALIASES[p] ?? []) push(alias);
  }

  for (const id of base) {
    push(id);
    for (const alias of GEMINI_MODEL_ALIASES[id] ?? []) push(alias);
  }

  return chain;
}

export function isRetryableModelError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes("503") ||
    msg.includes("UNAVAILABLE") ||
    msg.includes("high demand") ||
    msg.includes("overloaded") ||
    msg.includes("429") ||
    msg.includes("RESOURCE_EXHAUSTED") ||
    msg.includes("quota") ||
    msg.includes("rate limit") ||
    msg.includes("not found") ||
    msg.includes("NOT_FOUND") ||
    msg.includes("404")
  );
}
