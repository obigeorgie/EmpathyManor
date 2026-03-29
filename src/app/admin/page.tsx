"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { db, auth } from "@/lib/firebase";

/* ── Types ── */
interface Lead {
  id: string;
  name: string;
  company: string;
  score: number;
  status: string;
}

/* ── Constants ── */
const statusColors: Record<string, string> = {
  qualified: "bg-emerald-500/20 text-emerald-400 ring-emerald-500/30",
  contacted: "bg-sky-500/20 text-sky-400 ring-sky-500/30",
  pending: "bg-amber-500/20 text-amber-400 ring-amber-500/30",
  closed: "bg-violet-500/20 text-violet-400 ring-violet-500/30",
  lost: "bg-red-500/20 text-red-400 ring-red-500/30",
};

/* ────────────────────────────────────────────────────────
   Small UI components
   ──────────────────────────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  const colors =
    statusColors[lower] ?? "bg-zinc-700/40 text-zinc-400 ring-zinc-600/30";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${colors}`}
    >
      {status}
    </span>
  );
}

function ScoreBar({ score }: { score: number }) {
  const pct = Math.min(Math.max(score, 0), 100);
  const barColor =
    pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 w-20 rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-medium text-zinc-300">{score}</span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   Login Gate
   ──────────────────────────────────────────────────────── */

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess();
    } catch (err: unknown) {
      const code =
        err instanceof Error && "code" in err
          ? (err as { code: string }).code
          : "";
      switch (code) {
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/user-not-found":
          setError("No account found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password.");
          break;
        case "auth/invalid-credential":
          setError("Invalid email or password.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;
        default:
          setError("Login failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-600/8 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-60 -left-40 h-[600px] w-[600px] rounded-full bg-violet-600/8 blur-[140px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <svg
                className="h-7 w-7 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Admin Login
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              Sign in to access the Empathy Manor dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
              >
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-zinc-700/60 bg-zinc-800/50 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none ring-0 transition-all focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-zinc-700/60 bg-zinc-800/50 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none ring-0 transition-all focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="••••••••"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <svg
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                  />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/30 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              {submitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                    />
                  </svg>
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-zinc-600">
          Protected area · Empathy Manor Admin
        </p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   Main Page Component
   ──────────────────────────────────────────────────────── */

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  /* Listen to auth state */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  /* Fetch leads only when authenticated */
  useEffect(() => {
    if (!user) return;

    async function fetchLeads() {
      try {
        const snapshot = await getDocs(collection(db, "empathy_leads"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name ?? "—",
          company: doc.data().company ?? "—",
          score: doc.data().score ?? 0,
          status: doc.data().status ?? "pending",
        }));
        setLeads(data);
      } catch (err) {
        console.error("Failed to fetch leads:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, [user]);

  /* Auth loading spinner */
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
      </div>
    );
  }

  /* Not authenticated → show login */
  if (!user) {
    return <AdminLogin onSuccess={() => {}} />;
  }

  /* Authenticated → show dashboard */
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* ── Header ── */}
      <header className="border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Empathy Manor
              <span className="ml-2 text-sm font-medium text-zinc-500">
                Admin
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 ring-1 ring-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">Live</span>
            </div>

            {/* User info + Sign Out */}
            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-zinc-500 sm:inline">
                {user.email}
              </span>
              <button
                onClick={() => signOut(auth)}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-700/60 bg-zinc-800/50 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                  />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Stats row */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Total Leads", value: leads.length },
            {
              label: "Qualified",
              value: leads.filter((l) => l.status.toLowerCase() === "qualified")
                .length,
            },
            {
              label: "Avg Score",
              value: leads.length
                ? Math.round(
                    leads.reduce((s, l) => s + l.score, 0) / leads.length
                  )
                : 0,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-zinc-800/60 bg-zinc-900/50 p-5 backdrop-blur"
            >
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                {stat.label}
              </p>
              <p className="mt-1 text-3xl font-bold tabular-nums text-white">
                {loading ? "—" : stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm">
          <div className="border-b border-zinc-800/60 px-6 py-4">
            <h2 className="text-base font-semibold text-white">
              Investor Leads
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              All records from the{" "}
              <code className="text-zinc-400">empathy_leads</code> collection
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
            </div>
          ) : leads.length === 0 ? (
            <div className="py-20 text-center text-zinc-500">
              <p className="text-lg font-medium">No leads found</p>
              <p className="mt-1 text-sm">
                Add documents to your{" "}
                <code className="text-zinc-400">empathy_leads</code> Firestore
                collection to see data here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-800/60 text-xs uppercase tracking-wider text-zinc-500">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Company</th>
                    <th className="px-6 py-3 font-medium">Score</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="group transition-colors hover:bg-zinc-800/30"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-white">
                        {lead.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-zinc-400">
                        {lead.company}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <ScoreBar score={lead.score} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <StatusBadge status={lead.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
