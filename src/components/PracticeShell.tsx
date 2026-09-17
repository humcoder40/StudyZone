import Link from "next/link";

export function PracticeShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-8 sm:px-8 sm:py-12">
      <Link
        href="/"
        className="mb-8 inline-flex text-sm font-semibold text-brand hover:underline"
      >
        ← StudyZone
      </Link>
      <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">
        {eyebrow}
      </p>
      <h1
        className="mt-2 text-3xl text-ink sm:text-4xl"
        style={{ fontFamily: "var(--font-fraunces), serif" }}
      >
        {title}
      </h1>
      <div className="mt-8">{children}</div>
    </main>
  );
}
