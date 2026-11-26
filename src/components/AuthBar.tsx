"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";

export function AuthBar() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="text-xs font-medium text-muted">Checking session…</div>
    );
  }

  if (session?.user) {
    return (
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-muted">
          Signed in as{" "}
          <strong className="font-semibold text-ink">
            {session.user.name || session.user.email}
          </strong>
        </span>
        <button
          type="button"
          onClick={() => signOut()}
          className="rounded-xl border border-line bg-white/80 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-white"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <Link
        href="/login"
        className="rounded-xl border border-line bg-white/80 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-white"
      >
        Log in
      </Link>
      <Link
        href="/signup"
        className="rounded-xl bg-brand px-3 py-1.5 text-xs font-semibold text-white"
      >
        Sign up
      </Link>
    </div>
  );
}
