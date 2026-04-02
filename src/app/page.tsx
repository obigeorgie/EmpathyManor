import Link from "next/link";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30">
      {/* Navbar skeleton */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-6 lg:px-12 flex justify-between items-center backdrop-blur-md bg-slate-950/50 border-b border-slate-800/50">
        <div className="flex items-center space-x-3">
          <Logo className="w-8 h-8 text-slate-100" />
          <div className="text-xl font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-100 to-emerald-400">
            EMPATHY MANOR
          </div>
        </div>
        <div className="hidden md:flex space-x-8 text-sm text-slate-300">
          <Link href="#value-prop" className="hover:text-emerald-300 transition-colors">Our Edge</Link>
          <Link href="#mandate" className="hover:text-emerald-300 transition-colors">Current Mandates</Link>
          <Link href="#contact" className="hover:text-emerald-300 transition-colors">Contact</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 lg:px-12 overflow-hidden flex flex-col justify-center min-h-[90vh]">
        {/* Abstract background gradient */}
        <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute bottom-0 -left-1/4 w-[30rem] h-[30rem] bg-slate-800/40 rounded-full blur-[128px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white leading-[1.1]">
            Institutional Real Estate, <br className="hidden md:block"/>
            <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-emerald-500">First-Principles Execution.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Secure high-yield real estate in Nigeria through mathematically sound NGN/USD arbitrage. Frictionless acquisition designed exclusively for the diaspora.
          </p>
          <div className="pt-6">
            <a 
              href="#mandate" 
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium tracking-wide text-slate-950 bg-emerald-400 rounded-full hover:bg-emerald-300 transition-all duration-300 shadow-[0_0_30px_-5px_var(--color-emerald-500)] hover:shadow-[0_0_40px_-5px_var(--color-emerald-400)] hover:-translate-y-1"
            >
              Explore Opportunities
            </a>
          </div>
        </div>
      </header>

      {/* Value Proposition Section */}
      <section id="value-prop" className="py-24 px-6 lg:px-12 bg-slate-900/50 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4 text-white">The Empathy Advantage</h2>
            <div className="h-1 w-12 bg-emerald-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Column 1 */}
            <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm hover:border-emerald-500/30 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3 text-emerald-50">Asymmetric Leverage</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Exploit NGN/USD dislocations for mathematically sound 12-15% yields. Build multi-generational wealth by applying hard currency leverage in a highly decoupled asset class.
              </p>
            </div>

            {/* Column 2 */}
            <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm hover:border-emerald-500/30 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3 text-emerald-50">Frictionless Acquisition</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Institutional title verification and secure escrow routing. We systematically eliminate counterparty risk and operational friction before a single transaction executes.
              </p>
            </div>

            {/* Column 3 */}
            <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm hover:border-emerald-500/30 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3 text-emerald-50">Turnkey Execution</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                End-to-end asset management via proven execution partners. You command the capital allocation; we handle the operational intricacies of tenant placement and rent collection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Current Mandate Section */}
      <section id="mandate" className="py-24 px-6 lg:px-12 relative">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-64 bg-emerald-900/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <div className="text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-2">Featured Opportunity</div>
              <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white">Current Mandate</h2>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Accepting Commitments
              </span>
            </div>
          </div>
          
          {/* Featured Asset Card */}
          <div className="rounded-3xl overflow-hidden bg-slate-900/60 border border-slate-800 backdrop-blur-md flex flex-col md:flex-row group">
            {/* Mock Image Area (Can update to real Image component later) */}
            <div className="md:w-1/2 h-64 md:h-auto bg-slate-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900/90 to-transparent z-10"></div>
              {/* Optional: Add a real image if you have one, or keep a stylish placeholder/gradient pattern */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60 mix-blend-overlay"></div>
            </div>
            
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-medium text-white mb-2">Magodo GRA Phase 2 <br/>Luxury Duplex</h3>
              <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                An ultra-premium, fully detached 5-bedroom duplex in one of the most secure and desirable enclaves in Lagos. High rental demand from expatriates and corporate executives ensures consistent, high-yield returns.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Target Yield</div>
                  <div className="text-lg text-emerald-400 font-semibold">12.5% p.a.</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</div>
                  <div className="text-lg text-white">Title Verified</div>
                </div>
              </div>
              
              <a href="mailto:admin@empathymanor.com?subject=Inquiry:%20Magodo%20GRA%20Phase%202%20Escrow" className="w-full py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors border border-slate-700 hover:border-slate-600 flex justify-center items-center space-x-2">
                <span>Request Escrow Details</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 px-6 lg:px-12 border-t border-slate-800/80 bg-slate-950 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <div className="mb-4 md:mb-0 flex items-center space-x-2">
            <Logo className="w-5 h-5 text-slate-400" />
            <span><span className="font-semibold text-slate-300">EMPATHY MANOR</span> &copy; {new Date().getFullYear()}. All rights reserved.</span>
          </div>
          <div className="flex space-x-6">
            <a href="mailto:contact@empathymanor.com" className="hover:text-emerald-400 transition-colors">
              contact@empathymanor.com
            </a>
            <span className="opacity-30">|</span>
            <Link href="/terms" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
