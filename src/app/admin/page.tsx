"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Lead {
  id: string;
  name: string;
  company: string;
  score: number;
  status: string;
}

const statusColors: Record<string, string> = {
  qualified: "bg-emerald-500/20 text-emerald-400 ring-emerald-500/30",
  contacted: "bg-sky-500/20 text-sky-400 ring-sky-500/30",
  pending: "bg-amber-500/20 text-amber-400 ring-amber-500/30",
  closed: "bg-violet-500/20 text-violet-400 ring-violet-500/30",
  lost: "bg-red-500/20 text-red-400 ring-red-500/30",
};

function StatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  const colors = statusColors[lower] ?? "bg-zinc-700/40 text-zinc-400 ring-zinc-600/30";
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

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

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
          <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 ring-1 ring-emerald-500/20">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">Live</span>
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
              All records from the <code className="text-zinc-400">empathy_leads</code> collection
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
