import { PracticeShell } from "@/components/PracticeShell";
import { AiAnswerPanel } from "@/components/AiAnswerPanel";
import { EnToUrduPanel } from "@/components/EnToUrduPanel";
import { translations } from "@/data/exercises";

export default function TranslationPage() {
  const enUr = translations.filter((t) => t.direction === "en-ur");
  const urEn = translations.filter((t) => t.direction === "ur-en");

  return (
    <PracticeShell eyebrow="Board-style" title="Translation">
      <p className="mb-6 text-sm leading-relaxed text-muted">
        Same freedom as the board paper: for English paragraphs, either rewrite
        in simple English <strong>or</strong> upload a photo of your handwritten
        Urdu. Urdu→English stays typed.
      </p>
      <div className="grid gap-5">
        {enUr.map((t) => (
          <EnToUrduPanel key={t.id} item={t} />
        ))}
        {urEn.map((t) => (
          <AiAnswerPanel
            key={t.id}
            kind="translation"
            prompt={`${t.title} — write your English translation`}
            modelAnswer={t.modelAnswer}
            sourceText={t.source}
            urduSource
            chapterHint={t.notes}
          />
        ))}
      </div>
    </PracticeShell>
  );
}
