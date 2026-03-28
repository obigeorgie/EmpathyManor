"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface LeadData {
  name: string;
  company: string;
  score: number;
  status: string;
}

export default function DealRoom() {
  const { leadId } = useParams<{ leadId: string }>();
  const [lead, setLead] = useState<LeadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    async function fetchLead() {
      try {
        const snap = await getDoc(doc(db, "empathy_leads", leadId));
        if (snap.exists()) {
          const d = snap.data();
          setLead({
            name: d.name ?? "Investor",
            company: d.company ?? "",
            score: d.score ?? 0,
            status: d.status ?? "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch lead:", err);
      } finally {
        setLoading(false);
      }
    }
    if (leadId) fetchLead();
  }, [leadId]);

  function handleEscrowRequest() {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 4000);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Background gradient blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-60 -left-40 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[140px]" />

      {/* ── Header ── */}
      <header className="relative z-10 border-b border-zinc-800/60 bg-zinc-950/70 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-bold tracking-tight text-white">
            Empathy Manor{" "}
            <span className="text-zinc-500 font-medium">| Deal&nbsp;Room</span>
          </h1>
          {lead && (
            <span className="text-sm text-zinc-400">
              Welcome, <span className="text-white font-medium">{lead.name}</span>
            </span>
          )}
        </div>
      </header>

      {/* ── Main ── */}
      <main className="relative z-10 mx-auto max-w-5xl px-6 py-12">
        {/* Property hero card */}
        <section className="overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md">
          {/* Gradient banner */}
          <div className="relative h-48 bg-gradient-to-br from-emerald-600/30 via-teal-600/20 to-violet-600/20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDBoNjAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTAgMHY2MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=')] opacity-40" />
            <div className="absolute bottom-6 left-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/30 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Exclusive Listing
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 sm:p-10">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Magodo GRA Phase&nbsp;2 Luxury Duplex
            </h2>
            <p className="mt-2 text-zinc-400">
              Premium 5-bedroom fully detached duplex in one of Lagos&rsquo;s
              most prestigious gated communities. 24/7 security, modern
              finishes, and exceptional rental demand.
            </p>

            {/* Key metrics grid */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <MetricCard
                label="Projected Annual Yield"
                value="₦10,000,000"
                sublabel="Guaranteed rental income"
                accent="emerald"
              />
              <MetricCard
                label="Location"
                value="Magodo GRA 2"
                sublabel="Lagos, Nigeria"
                accent="sky"
              />
              <MetricCard
                label="Property Type"
                value="Luxury Duplex"
                sublabel="5-bed fully detached"
                accent="violet"
              />
            </div>

            {/* Investment highlights */}
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                  Why This Property
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {[
                    "Gated community with 24/7 armed security",
                    "High-demand rental corridor — 98% occupancy rate",
                    "USD-indexed returns protect against naira volatility",
                    "FEM Limited property management included",
                    "Full legal title & Governor's Consent available",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-zinc-300">
                      <span className="mt-0.5 text-emerald-500">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                  Deal Structure
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {[
                    "Escrow-protected transaction via verified solicitors",
                    "Quarterly yield disbursements to your domiciliary account",
                    "Remote management — zero trips required",
                    "Exit liquidity available after 24-month lock-in",
                    "Transparent fee structure — no hidden costs",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-zinc-300">
                      <span className="mt-0.5 text-violet-500">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <button
                onClick={handleEscrowRequest}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/30 active:scale-[0.98]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                Request Escrow Details
              </button>
              <p className="text-xs text-zinc-500">
                A dedicated relationship manager will contact you within 24 hours.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ── Toast ── */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
          toastVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-zinc-900/90 px-5 py-3.5 shadow-2xl backdrop-blur-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
            <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Request Sent</p>
            <p className="text-xs text-zinc-400">
              Our team will send escrow details shortly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Metric Card ── */
function MetricCard({
  label,
  value,
  sublabel,
  accent,
}: {
  label: string;
  value: string;
  sublabel: string;
  accent: "emerald" | "sky" | "violet";
}) {
  const border = {
    emerald: "border-emerald-500/20",
    sky: "border-sky-500/20",
    violet: "border-violet-500/20",
  }[accent];
  const textColor = {
    emerald: "text-emerald-400",
    sky: "text-sky-400",
    violet: "text-violet-400",
  }[accent];

  return (
    <div
      className={`rounded-2xl border ${border} bg-zinc-900/60 p-5 backdrop-blur`}
    >
      <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${textColor}`}>{value}</p>
      <p className="mt-0.5 text-xs text-zinc-500">{sublabel}</p>
    </div>
  );
}
