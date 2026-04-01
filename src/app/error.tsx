"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6 text-red-500 border border-red-500/20">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <div className="text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-2">Empathy Manor</div>
        <h1 className="text-2xl font-light text-white tracking-tight mb-4">System Vault Error</h1>
        
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          An unexpected error occurred while accessing the vault.
        </p>
        
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center w-full px-5 py-3.5 text-sm font-medium tracking-wide text-white bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
