import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
        <div className="text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-2">Empathy Manor</div>
        <h1 className="text-4xl font-light text-white tracking-tight mb-2">404</h1>
        <h2 className="text-xl font-medium text-slate-300 mb-6">Page Not Found</h2>
        
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          The requested property or document could not be located.
        </p>
        
        <Link 
          href="/"
          className="inline-flex items-center justify-center w-full px-5 py-3.5 text-sm font-medium tracking-wide text-slate-900 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors shadow-[0_0_20px_-5px_var(--color-emerald-500)] hover:shadow-[0_0_30px_-5px_var(--color-emerald-400)]"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
