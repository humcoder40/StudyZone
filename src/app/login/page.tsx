"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: err } = await signIn.email({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (err) {
      setError(err.message || "Could not sign in");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-12 sm:px-8">
      <Link href="/" className="mb-8 text-sm font-semibold text-brand hover:underline">
        ← StudyZone
      </Link>
      <h1
        className="text-3xl text-ink"
        style={{ fontFamily: "var(--font-fraunces), serif" }}
      >
        Log in
      </h1>
      <p className="mt-2 text-sm text-muted">
        Use the email and password you created for StudyZone.
      </p>

      <form onSubmit={onSubmit} className="mt-8 grid gap-4">
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-ink">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-2xl border border-line bg-white/90 px-4 py-3 outline-none ring-brand/30 focus:ring-2"
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-ink">Password</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-2xl border border-line bg-white/90 px-4 py-3 outline-none ring-brand/30 focus:ring-2"
          />
        </label>
        {error ? (
          <p className="rounded-2xl bg-bad-soft px-4 py-3 text-sm text-bad">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        No account yet?{" "}
        <Link href="/signup" className="font-semibold text-brand hover:underline">
          Sign up
        </Link>
      </p>
    </main>
  );
}
