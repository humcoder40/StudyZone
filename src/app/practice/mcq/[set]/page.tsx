import { notFound } from "next/navigation";
import { PracticeShell } from "@/components/PracticeShell";
import { McqQuiz } from "@/components/McqQuiz";
import { mcqSets } from "@/data/exercises";

export function generateStaticParams() {
  return mcqSets.map((s) => ({ set: s.id }));
}

export default async function McqSetPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set: setId } = await params;
  const set = mcqSets.find((s) => s.id === setId);
  if (!set) notFound();

  return (
    <PracticeShell eyebrow="Objective practice" title={set.title}>
      <McqQuiz set={set} />
    </PracticeShell>
  );
}
