import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { CHAPTER_CONTEXT } from "@/data/exercises";
import {
  expandModelChain,
  isRetryableModelError,
} from "@/lib/geminiModels";

export const runtime = "nodejs";
export const maxDuration = 60; // Vercel: enough for Gemini grading + fallbacks

type Body = {
  kind: "short" | "translation" | "pairs";
  mode?: "simple-english" | "urdu-photo" | "text";
  prompt: string;
  studentAnswer: string;
  modelAnswer: string;
  sourceText?: string;
  imageDataUrl?: string;
};

type GradeJson = {
  score?: number;
  maxScore?: number;
  feedback?: string;
  strengths?: string;
  missing?: string;
  spellingMistakes?: Array<{ wrong?: string; correct?: string }> | string[];
  mechanicsMistakes?: Array<{
    type?: string;
    issue?: string;
    fix?: string;
    example?: string;
  }>;
  transcribedUrdu?: string;
};

function normalizeSpelling(
  raw: GradeJson["spellingMistakes"],
): Array<{ wrong: string; correct: string }> {
  if (!raw || !Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (typeof item === "string") {
        const parts = item.split(/->|→|:/).map((s) => s.trim());
        if (parts.length >= 2) return { wrong: parts[0], correct: parts[1] };
        return { wrong: item, correct: "" };
      }
      return {
        wrong: String(item.wrong ?? ""),
        correct: String(item.correct ?? ""),
      };
    })
    .filter((x) => x.wrong);
}

function normalizeMechanics(
  raw: GradeJson["mechanicsMistakes"],
): Array<{ type: string; issue: string; fix: string; example: string }> {
  if (!raw || !Array.isArray(raw)) return [];
  return raw
    .map((item) => ({
      type: String(item.type ?? "mechanics"),
      issue: String(item.issue ?? ""),
      fix: String(item.fix ?? ""),
      example: String(item.example ?? ""),
    }))
    .filter((x) => x.issue || x.fix);
}

function parseDataUrl(dataUrl: string): { mimeType: string; data: string } | null {
  const match = /^data:([^;]+);base64,(.+)$/i.exec(dataUrl);
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY in web/.env.local" },
        { status: 500 },
      );
    }

    const body = (await req.json()) as Body;
    const mode = body.mode || "text";
    const hasImage = Boolean(body.imageDataUrl);

    if (mode === "urdu-photo" && !hasImage) {
      return NextResponse.json(
        { error: "Missing Urdu photo" },
        { status: 400 },
      );
    }

    if (mode !== "urdu-photo" && (!body?.studentAnswer?.trim() || !body?.prompt)) {
      return NextResponse.json(
        { error: "Missing student answer" },
        { status: 400 },
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const models = expandModelChain(process.env.GEMINI_MODEL, {
      vision: mode === "urdu-photo" || hasImage,
    });

    const system =
      mode === "urdu-photo"
        ? `You are a Class 10 English teacher in Pakistan (PTB / board style).
The student uploaded a PHOTO of their handwritten Urdu translation.
1) Read/OCR the Urdu handwriting carefully (Nastaliq OK).
2) Grade meaning against the English source and the model Urdu answer.
3) Be fair to handwriting OCR uncertainty — if unclear, say so.
4) Spelling/punctuation of English do not apply; focus on translation meaning.

Return ONLY valid JSON:
{
  "score": 0-5,
  "maxScore": 5,
  "feedback": "short comment",
  "strengths": "...",
  "missing": "...",
  "transcribedUrdu": "what you read from the photo",
  "spellingMistakes": [],
  "mechanicsMistakes": []
}
No markdown fences.`
        : mode === "simple-english"
          ? `You are a Class 10 English teacher in Pakistan (PTB / board style).
The student chose the board option: rewrite the paragraph into SIMPLE English (not Urdu).
Grade clarity, meaning fidelity to the source, spelling, punctuation, and capital letters.

Return ONLY valid JSON:
{
  "score": 0-5,
  "maxScore": 5,
  "feedback": "short comment",
  "strengths": "...",
  "missing": "...",
  "spellingMistakes": [{"wrong":"...","correct":"..."}],
  "mechanicsMistakes": [{"type":"capitalization|punctuation|full_stop|other","issue":"...","fix":"...","example":"..."}]
}
Empty arrays if none. No markdown fences.`
          : `You are a strict-but-kind Class 10 English teacher in Pakistan (PTB / board style).

Grade the student's answer against the chapter material and the model answer.

CONTENT:
- Be fair: accept correct ideas in different wording.
- For Urdu↔English translation, focus on meaning accuracy.

SPELLING (mandatory for English text):
- Check EVERY typed English word for spelling mistakes.
- List each misspelling with the correct spelling.
- Spelling errors must lower the score.

PUNCTUATION & CAPITALIZATION (mandatory for English text):
Flag missing full stops, missing capitals at sentence start, "i" vs "I", proper nouns, run-ons, etc.
These must lower the score slightly.

If mostly Urdu, focus on meaning; still flag English mechanics if present.

Return ONLY valid JSON:
{
  "score": number 0-5,
  "maxScore": 5,
  "feedback": "short overall comment",
  "strengths": "what was good",
  "missing": "what content is missing",
  "spellingMistakes": [{"wrong":"teh","correct":"the"}],
  "mechanicsMistakes": [{"type":"capitalization|punctuation|full_stop|other","issue":"...","fix":"...","example":"..."}]
}
If none, use empty arrays []. No markdown fences.`;

    const userText = `
CHAPTER CONTEXT:
${CHAPTER_CONTEXT}

TASK TYPE: ${body.kind}
MODE: ${mode}
QUESTION / INSTRUCTION: ${body.prompt}
${body.sourceText ? `SOURCE TEXT:\n${body.sourceText}\n` : ""}
MODEL ANSWER:
${body.modelAnswer}

STUDENT ANSWER:
${mode === "urdu-photo" ? "(Urdu handwriting is in the attached image)" : body.studentAnswer}
`.trim();

    let lastError: unknown = null;
    let usedModel = models[0];
    let text = "";
    const tried: string[] = [];

    const image = hasImage && body.imageDataUrl
      ? parseDataUrl(body.imageDataUrl)
      : null;

    for (const model of models) {
      tried.push(model);
      try {
        usedModel = model;
        const contents =
          image
            ? [
                {
                  role: "user" as const,
                  parts: [
                    { inlineData: { mimeType: image.mimeType, data: image.data } },
                    { text: userText },
                  ],
                },
              ]
            : userText;

        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            temperature: 0.2,
            systemInstruction: system,
            responseMimeType: "application/json",
          },
        });
        text = response.text?.trim() || "";
        if (!text) {
          lastError = new Error(`Empty response from ${model}`);
          continue;
        }
        lastError = null;
        break;
      } catch (err) {
        lastError = err;
        if (isRetryableModelError(err)) continue;
        throw err;
      }
    }

    if (lastError || !text) {
      const msg =
        lastError instanceof Error ? lastError.message : "All models failed";
      return NextResponse.json(
        {
          error:
            "All free Gemini models are busy or out of quota right now. Try again in a minute.",
          detail: msg,
          tried,
        },
        { status: 503 },
      );
    }

    let parsed: GradeJson;
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          score: 3,
          maxScore: 5,
          feedback: text || "Could not parse AI response; try again.",
          strengths: "",
          missing: "Compare with the model answer.",
          spellingMistakes: [],
          mechanicsMistakes: [],
          transcribedUrdu: "",
          modelUsed: usedModel,
        },
        { status: 200 },
      );
    }

    return NextResponse.json({
      score: Number(parsed.score ?? 0),
      maxScore: Number(parsed.maxScore ?? 5),
      feedback: String(parsed.feedback ?? ""),
      strengths: String(parsed.strengths ?? ""),
      missing: String(parsed.missing ?? ""),
      spellingMistakes: normalizeSpelling(parsed.spellingMistakes),
      mechanicsMistakes: normalizeMechanics(parsed.mechanicsMistakes),
      transcribedUrdu: String(parsed.transcribedUrdu ?? ""),
      modelUsed: usedModel,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Grading failed";
    if (isRetryableModelError(err)) {
      return NextResponse.json(
        {
          error:
            "Gemini is busy or out of quota. Trying again later usually works.",
          detail: message,
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
