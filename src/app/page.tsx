"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Empathy Manor
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Partner Login
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24 sm:py-32">
        {/* Background Gradients */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-600/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-0 -z-10 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[100px]" />

        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Premium Real Estate Opportunities
          </span>

          <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
            Build Wealth Back Home.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">
              Securely.
            </span>
          </h1>

          <p className="mt-8 mx-auto max-w-2xl text-lg text-zinc-400 sm:text-xl leading-relaxed">
            Exclusive access to vetted, high-yield luxury properties in Nigeria's most prestigious gated communities. Designed specifically for the diaspora.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-white px-8 py-4 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-200 active:scale-[0.98]">
              Apply for Access
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 px-8 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-zinc-800">
              View Portfolio
            </button>
          </div>
          <p className="mt-6 text-sm text-zinc-500">
            Available strictly by invitation or application.
          </p>
        </div>
      </main>

      {/* ── Features Grid ── */}
      <section className="border-t border-zinc-800/60 bg-zinc-900/30 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Why Invest With Empathy Manor
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "Vetted Properties",
                desc: "We only list properties with verified titles, Governor's Consent, and strict legal due diligence.",
                icon: (
                  <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                  </svg>
                )
              },
              {
                title: "Complete Transparency",
                desc: "Monitor your investments remotely. See projected yields, access real-time construction updates, and view your escrow status securely.",
                icon: (
                  <svg className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 19.5 16.5h-2.25m-10.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                  </svg>
                )
              },
              {
                title: "Secure Escrow",
                desc: "Your funds are protected. Investments are held in verified escrow accounts and only disbursed upon verified project milestones.",
                icon: (
                  <svg className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                )
              }
            ].map((feature, idx) => (
              <div key={idx} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 hover:bg-zinc-800/50 transition-colors">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-800/80 p-8 text-center bg-zinc-950">
        <p className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Empathy Manor Limited. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
