import { PracticeShell } from "@/components/PracticeShell";
import { AiAnswerPanel } from "@/components/AiAnswerPanel";
import { getShortQuestions } from "@/lib/practice";

export const dynamic = "force-dynamic";

export default async function ShortQuestionsPage() {
  const shortQuestions = await getShortQuestions();

  return (
    <PracticeShell
      eyebrow="Unit 1 · Social Reforms"
      title="Short Questions"
    >
      <p className="mb-2 text-xs font-medium tracking-wide text-muted uppercase">
        Loaded from Neon · unit1-practice
      </p>
      <p className="mb-6 text-sm leading-relaxed text-muted">
        Answer in your own words. Use <strong>Show model answer</strong> to
        compare, or <strong>Check with AI</strong> for Gemini feedback against
        the chapter.
      </p>
      <div className="grid gap-5">
        {shortQuestions.map((q) => (
          <AiAnswerPanel
            key={q.id}
            kind="short"
            questionId={q.id}
            prompt={q.prompt}
            modelAnswer={q.modelAnswer}
            chapterHint={q.chapterHint}
          />
        ))}
      </div>
    </PracticeShell>
  );
}
