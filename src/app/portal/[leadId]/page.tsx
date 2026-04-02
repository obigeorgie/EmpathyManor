"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { LeadData } from "@/types/lead";

export default function DealRoom() {
  const { leadId } = useParams<{ leadId: string }>();
  const [lead, setLead] = useState<LeadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", body: "" });
  const [requesting, setRequesting] = useState(false);
  const [alreadyRequested, setAlreadyRequested] = useState(false);

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
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Failed to fetch lead:", err);
        setError("Unable to load deal details. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    if (leadId) fetchLead();
  }, [leadId]);

  const showToast = useCallback(
    (title: string, body: string) => {
      setToastMessage({ title, body });
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 5000);
    },
    []
  );

  async function handleEscrowRequest() {
    if (requesting || alreadyRequested) return;
    setRequesting(true);
    try {
      await addDoc(collection(db, "escrow_requests"), {
        leadId,
        leadName: lead?.name ?? "Unknown",
        leadCompany: lead?.company ?? "",
        requestedAt: serverTimestamp(),
        status: "pending",
      });
      setAlreadyRequested(true);
      showToast(
        "Request Sent",
        "Our team will send escrow details within 24 hours."
      );
    } catch (err) {
      console.error("Escrow request failed:", err);
      showToast(
        "Request Failed",
        "Something went wrong. Please try again."
      );
    } finally {
      setRequesting(false);
    }
  }

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 ring-1 ring-red-500/20">
          <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white">Something went wrong</h1>
        <p className="max-w-md text-sm text-zinc-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 rounded-lg bg-zinc-800 px-5 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  /* ── Not found state ── */
  if (notFound || !lead) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20">
          <svg className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white">Deal not found</h1>
        <p className="max-w-md text-sm text-zinc-400">
          The deal room you&rsquo;re looking for doesn&rsquo;t exist or the link
          may have expired. Please contact your relationship manager for an
          updated link.
        </p>
        <Link
          href="/"
          className="mt-2 rounded-lg bg-zinc-800 px-5 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  /* ── Deal Room ── */
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
          <span className="text-sm text-zinc-400">
            Welcome,{" "}
            <span className="text-white font-medium">{lead.name}</span>
          </span>
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
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-zinc-300"
                    >
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
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-zinc-300"
                    >
                      <span className="mt-0.5 text-violet-500">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 flex flex-col gap-4">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <button
                  onClick={handleEscrowRequest}
                  disabled={requesting || alreadyRequested}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/30 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  {requesting ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                      />
                    </svg>
                  )}
                  {alreadyRequested
                    ? "Request Sent ✓"
                    : requesting
                      ? "Sending…"
                      : "Request Escrow Details"}
                </button>
                <a 
                  href="https://wa.me/18329673513?text=Hi,%20I'm%20reviewing%20my%20Empathy%20Manor%20Deal%20Room%20and%20have%20a%20question."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-7 py-3.5 text-sm font-semibold text-zinc-300 transition-all hover:border-[#25D366]/50 hover:text-[#25D366] hover:bg-[#25D366]/5 active:scale-[0.98]"
                >
                  <svg className="h-5 w-5 text-[#25D366]/70 group-hover:text-[#25D366] transition-colors" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                  Chat with Managing Partner on WhatsApp
                </a>
              </div>
              <p className="text-xs text-zinc-500">
                {alreadyRequested
                  ? "You'll hear from us within 24 hours."
                  : "A dedicated relationship manager will contact you within 24 hours."}
              </p>
            </div>
          </div>
        </section>

        {/* ── Arbitrage ROI Calculator ── */}
        <ArbitrageROICalculator />
      </main>

      {/* ── Toast ── */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
          toastVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`flex items-center gap-3 rounded-xl border px-5 py-3.5 shadow-2xl backdrop-blur-lg ${
            toastMessage.title === "Request Failed"
              ? "border-red-500/20 bg-zinc-900/90"
              : "border-emerald-500/20 bg-zinc-900/90"
          }`}
        >
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              toastMessage.title === "Request Failed"
                ? "bg-red-500/20"
                : "bg-emerald-500/20"
            }`}
          >
            {toastMessage.title === "Request Failed" ? (
              <svg
                className="h-4 w-4 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            )}
          </span>
          <div>
            <p className="text-sm font-semibold text-white">
              {toastMessage.title}
            </p>
            <p className="text-xs text-zinc-400">{toastMessage.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Arbitrage ROI Calculator ── */
function ArbitrageROICalculator() {
  const [propertyValue, setPropertyValue] = useState(150_000_000);
  const [rentalYield, setRentalYield] = useState(10_000_000);
  const [exchangeRate, setExchangeRate] = useState(1500);

  const acquisitionUSD = propertyValue / exchangeRate;
  const annualCashFlowUSD = rentalYield / exchangeRate;
  const cashOnCash = acquisitionUSD > 0 ? (annualCashFlowUSD / acquisitionUSD) * 100 : 0;

  const fmtNGN = (n: number) =>
    "₦" + n.toLocaleString("en-NG", { maximumFractionDigits: 0 });
  const fmtUSD = (n: number) =>
    "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <section
      id="roi-calculator"
      className="mt-10 overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md"
    >
      {/* Header */}
      <div className="border-b border-zinc-800/60 px-6 py-5 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/25">
            <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75V18m15-8.25v6.75a2.25 2.25 0 0 1-2.25 2.25H3a2.25 2.25 0 0 1-2.25-2.25V9.75m22.5 0V6.75A2.25 2.25 0 0 0 21 4.5H3A2.25 2.25 0 0 0 .75 6.75v3m22.5 0H.75" />
            </svg>
          </span>
          <div>
            <h3 className="text-lg font-bold text-white">Arbitrage ROI Calculator</h3>
            <p className="text-xs text-zinc-500">Stress-test your returns across exchange rate scenarios</p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-10">
        {/* Sliders */}
        <div className="space-y-8">
          {/* Property Value */}
          <SliderInput
            id="calc-property-value"
            label="Estimated Property Value"
            value={propertyValue}
            onChange={setPropertyValue}
            min={50_000_000}
            max={500_000_000}
            step={5_000_000}
            format={fmtNGN}
          />

          {/* Rental Yield */}
          <SliderInput
            id="calc-rental-yield"
            label="Expected Annual Rental Yield"
            value={rentalYield}
            onChange={setRentalYield}
            min={1_000_000}
            max={50_000_000}
            step={500_000}
            format={fmtNGN}
          />

          {/* Exchange Rate */}
          <SliderInput
            id="calc-exchange-rate"
            label="NGN to USD Exchange Rate"
            value={exchangeRate}
            onChange={setExchangeRate}
            min={500}
            max={5000}
            step={25}
            format={(v) => `₦${v.toLocaleString()} / $1`}
          />
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent" />

        {/* Output Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-sky-500/20 bg-zinc-900/60 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-wider text-zinc-500">Acquisition Cost</p>
            <p className="mt-1 text-2xl font-bold text-sky-400">{fmtUSD(acquisitionUSD)}</p>
            <p className="mt-0.5 text-xs text-zinc-500">Total in USD</p>
          </div>

          <div className="rounded-2xl border border-violet-500/20 bg-zinc-900/60 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-wider text-zinc-500">Annual Cash Flow</p>
            <p className="mt-1 text-2xl font-bold text-violet-400">{fmtUSD(annualCashFlowUSD)}</p>
            <p className="mt-0.5 text-xs text-zinc-500">Net rental in USD</p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-zinc-900/60 p-5 backdrop-blur relative overflow-hidden">
            {/* Glow behind ROI number */}
            <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl" />
            <p className="text-xs uppercase tracking-wider text-zinc-500">Cash-on-Cash Return</p>
            <p className="mt-1 text-3xl font-extrabold text-emerald-400">
              {cashOnCash.toFixed(2)}
              <span className="text-xl">%</span>
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">Annual ROI</p>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-[11px] leading-relaxed text-zinc-600">
          Projections are estimates for illustrative purposes only and do not constitute financial advice.
          Actual returns may vary based on occupancy, maintenance costs, and currency fluctuations.
        </p>
      </div>
    </section>
  );
}

/* ── Slider Input ── */
function SliderInput({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-zinc-300">
          {label}
        </label>
        <span className="rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-sm font-semibold tabular-nums text-white">
          {format(value)}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="calc-slider w-full cursor-pointer appearance-none rounded-full bg-zinc-800 h-2 outline-none"
        style={{
          background: `linear-gradient(to right, #34d399 0%, #34d399 ${pct}%, #3f3f46 ${pct}%, #3f3f46 100%)`,
        }}
      />
      <div className="mt-1 flex justify-between text-[10px] text-zinc-600">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
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
