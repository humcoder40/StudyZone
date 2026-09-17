import { PracticeShell } from "@/components/PracticeShell";
import { AiAnswerPanel } from "@/components/AiAnswerPanel";
import { shortQuestions } from "@/data/exercises";

export default function ShortQuestionsPage() {
  return (
    <PracticeShell
      eyebrow="Unit 1 · Social Reforms"
      title="Short Questions"
    >
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
            prompt={q.prompt}
            modelAnswer={q.modelAnswer}
            chapterHint={q.chapterHint}
          />
        ))}
      </div>
    </PracticeShell>
  );
}
