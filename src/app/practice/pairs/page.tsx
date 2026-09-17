import { PracticeShell } from "@/components/PracticeShell";
import { AiAnswerPanel } from "@/components/AiAnswerPanel";
import { pairs } from "@/data/exercises";

export default function PairsPage() {
  return (
    <PracticeShell eyebrow="Vocabulary" title="Pair of Words">
      <p className="mb-6 text-sm leading-relaxed text-muted">
        Use each pair in your own sentences (one sentence per word). Then reveal
        model sentences or ask AI to check.
      </p>
      <div className="grid gap-5">
        {pairs.map((p) => (
          <AiAnswerPanel
            key={p.id}
            kind="pairs"
            prompt={`Use “${p.word1}” and “${p.word2}” in your own sentences.`}
            modelAnswer={`${p.word1}: ${p.modelSentences[0]}\n${p.word2}: ${p.modelSentences[1]}`}
            chapterHint={p.tip}
          />
        ))}
      </div>
    </PracticeShell>
  );
}
