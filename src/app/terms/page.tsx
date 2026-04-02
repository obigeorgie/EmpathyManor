import Link from "next/link";
import Logo from "@/components/Logo";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 selection:bg-emerald-500/30">
      <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-6 lg:px-12 flex justify-between items-center backdrop-blur-md bg-neutral-950/50 border-b border-neutral-800/50">
        <Link href="/" className="flex items-center space-x-3">
          <Logo className="w-8 h-8 text-neutral-100" />
          <div className="text-xl font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-100 to-emerald-400">
            EMPATHY MANOR
          </div>
        </Link>
        <div className="hidden md:flex space-x-8 text-sm text-neutral-300">
          <Link href="/#value-prop" className="hover:text-emerald-300 transition-colors">Our Edge</Link>
          <Link href="/#mandate" className="hover:text-emerald-300 transition-colors">Current Mandates</Link>
          <a href="mailto:contact@empathymanor.com" className="hover:text-emerald-300 transition-colors">Contact</a>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 lg:px-12 max-w-4xl mx-auto space-y-12">
        <header>
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4">Terms of Service</h1>
          <p className="text-neutral-400">Effective Date: April 2026</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-medium text-emerald-100">1. Platform Use</h2>
          <p className="leading-relaxed">
            By engaging with the Empathy Manor platform, you actively consent to these explicit Terms of Service. Our infrastructure provides high-net-worth diaspora professionals with frictionless access to verified real estate mandates in Nigeria. Utilization is restricted wholly to lawful investment research and executable operational mandates.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-medium text-emerald-100">2. Real Estate Disclaimer</h2>
          <p className="leading-relaxed">
            Empathy Manor functions strictly as a technology and routing protocol, aligning prospective capital allocators with vetted physical assets and escrow execution partners. Empathy Manor is decisively not a registered real estate broker, licensed financial advisory unit, or legal firm. All execution rely fundamentally on trusted operational proxies.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-medium text-emerald-100">3. Investment Risks</h2>
          <p className="leading-relaxed">
            Emerging market real estate inherently bundles asymmetric risk dynamics, encompassing currency displacement, constrained liquidity, and operational volatility. Though we curate mathematically sound NGN/USD arbitrage operations, historical outcomes do not assure continued performance. The investor invariably retains full sovereign control and assumes respective risk.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-medium text-emerald-100">4. Governing Law</h2>
          <p className="leading-relaxed">
            These mandates are conclusively governed by the jurisdiction encompassing Empathy Manor's operational headquarters, overriding localized conflict of law precepts. Disputations referencing this technological interface remain bound specifically within said designated jurisdiction.
          </p>
        </section>
      </main>

      <footer className="py-12 px-6 lg:px-12 border-t border-neutral-800/80 mt-12 bg-neutral-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500">
          <div className="mb-4 md:mb-0 flex items-center space-x-2">
            <Logo className="w-5 h-5 text-neutral-400" />
            <span><span className="font-semibold text-neutral-300">EMPATHY MANOR</span> &copy; {new Date().getFullYear()}. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 md:gap-6 mt-4 md:mt-0">
            <a href="mailto:contact@empathymanor.com" className="hover:text-emerald-400 transition-colors">
              contact@empathymanor.com
            </a>
            <span className="hidden md:inline opacity-30">|</span>
            <a href="https://wa.me/18329673513?text=Hi,%20I'm%20reviewing%20my%20Empathy%20Manor%20Deal%20Room%20and%20have%20a%20question." target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition-colors">
              WhatsApp
            </a>
            <span className="hidden md:inline opacity-30">|</span>
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
