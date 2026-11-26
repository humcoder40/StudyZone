import { notFound } from "next/navigation";
import { PracticeShell } from "@/components/PracticeShell";
import { McqQuiz } from "@/components/McqQuiz";
import { getMcqSet, getMcqSets } from "@/lib/practice";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const sets = await getMcqSets();
    return sets.map((s) => ({ set: s.id }));
  } catch {
    return [{ set: "set-1" }, { set: "set-2" }, { set: "set-3" }];
  }
}

export default async function McqSetPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set: setId } = await params;
  const set = await getMcqSet(setId);
  if (!set) notFound();

  return (
    <PracticeShell eyebrow="Objective practice" title={set.title}>
      <p className="mb-4 text-xs font-medium tracking-wide text-muted uppercase">
        Loaded from Neon · unit1-practice
      </p>
      <McqQuiz set={set} />
    </PracticeShell>
  );
}
