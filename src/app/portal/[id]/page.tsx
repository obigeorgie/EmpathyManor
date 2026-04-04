'use client';

import { use, useState } from 'react';

interface PropertyData {
  id: string;
  name: string;
  priceNGN: number;
}

export default function PortalPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const propertyId = resolvedParams.id;

  // Hardcoded property state
  const [property] = useState<PropertyData>({
    id: propertyId,
    name: 'Magodo GRA Phase 2',
    priceNGN: 150000000,
  });

  const [exchangeRate, setExchangeRate] = useState<number>(1378);
  const [projectedRentUSD, setProjectedRentUSD] = useState<number>(12000);
  
  const [isReserving, setIsReserving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Core Financial Modeling Calculations
  const acquisitionCostUSD = property.priceNGN / exchangeRate;
  const cashOnCashROI = (projectedRentUSD / acquisitionCostUSD) * 100;

  const handleReserve = async () => {
    setIsReserving(true);
    // Simulate an API call to reserve the asset and trigger escrow
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsReserving(false);
    setShowToast(true);
    // Auto-hide toast after 4 seconds
    setTimeout(() => setShowToast(false), 4000);
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Deal Header Section */}
        <header className="border-b border-slate-800 pb-6 mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
            Deal Room
          </h1>
          <p className="text-xl text-slate-400 font-light flex items-center flex-wrap gap-2">
            {property.name} 
            <span className="text-xs font-mono font-medium bg-slate-800 text-slate-400 px-2 py-1 rounded">
              ID: {property.id}
            </span>
          </p>
        </header>

        {/* Financials Modeling Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Left Column: Scenario Inputs */}
          <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl shadow-black/40">
            <h2 className="text-2xl font-semibold mb-8 flex items-center text-slate-200 border-b border-slate-800 pb-4">
              <span className="bg-slate-800/80 p-2 rounded-lg mr-3 text-emerald-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              </span>
              Scenario Modeling
            </h2>

            <div className="space-y-10">
              {/* Static Value: Local Market Price */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">
                  Local Market Price (NGN)
                </label>
                <div className="text-3xl font-bold text-white font-mono">
                  {formatCurrency(property.priceNGN, 'NGN')}
                </div>
              </div>

              {/* Slider 1: Exchange Rate */}
              <div>
                <div className="flex items-end justify-between mb-3 border-t border-slate-800 pt-6">
                  <label htmlFor="exchangeRate" className="text-sm font-medium text-slate-300">
                    Expected FX Rate <span className="text-slate-500 font-normal">(NGN/USD)</span>
                  </label>
                  <span className="text-emerald-400 font-mono font-medium text-base bg-emerald-400/10 px-3 py-1 rounded-md">
                    ₦{exchangeRate}
                  </span>
                </div>
                <input 
                  id="exchangeRate"
                  type="range" 
                  min="1000" 
                  max="2000" 
                  step="5"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              {/* Slider 2: Projected Rent */}
              <div>
                <div className="flex items-end justify-between mb-3 border-t border-slate-800 pt-6">
                  <label htmlFor="projectedRentUSD" className="text-sm font-medium text-slate-300">
                    Projected Annual Rent <span className="text-slate-500 font-normal">(USD)</span>
                  </label>
                  <span className="text-emerald-400 font-mono font-medium text-base bg-emerald-400/10 px-3 py-1 rounded-md">
                    {formatCurrency(projectedRentUSD, 'USD')}
                  </span>
                </div>
                <input 
                  id="projectedRentUSD"
                  type="range" 
                  min="5000" 
                  max="40000" 
                  step="500"
                  value={projectedRentUSD}
                  onChange={(e) => setProjectedRentUSD(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Calculations & Call to Action */}
          <div className="flex flex-col gap-6 lg:gap-8">
            
            {/* Projected Returns Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-slate-700/50 shadow-xl shadow-black/40">
              <div className="absolute top-0 right-0 p-6 opacity-10 text-emerald-500">
                <svg className="w-32 h-32 transform translate-x-4 -translate-y-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              
              <div className="relative z-10 space-y-8">
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500/50"></div>
                    Est. USD Acquisition Cost
                  </h3>
                  <div className="text-4xl sm:text-5xl font-bold text-white font-mono tracking-tight">
                    {formatCurrency(acquisitionCostUSD, 'USD')}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    Projected Cash-on-Cash ROI
                  </h3>
                  <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300 drop-shadow-sm font-mono filter drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                    {cashOnCashROI.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Action Box */}
            <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl shadow-black/40 flex-grow flex flex-col justify-center">
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Review the simulated returns based on your dynamic metrics. If this arbitrage opportunity aligns with your fund's investment thesis, lock in the pricing now.
              </p>
              
              <button
                onClick={handleReserve}
                disabled={isReserving}
                className="group relative w-full overflow-hidden rounded-xl bg-emerald-600 px-6 py-4 text-center font-semibold text-white shadow-[0_0_20px_rgba(5,150,105,0.3)] transition-all hover:bg-emerald-500 hover:shadow-[0_0_30px_rgba(5,150,105,0.5)] active:scale-[0.98] disabled:scale-100 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-emerald-600 disabled:hover:shadow-none"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                {isReserving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white/80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Request...
                  </span>
                ) : (
                  'Reserve Asset & Request Escrow'
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Global Scoped Toast Styling / Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-toast {
          animation: slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* Toast Notification Container */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-toast">
          <div className="bg-slate-800 border border-emerald-500/30 text-white px-5 py-4 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-start gap-4 backdrop-blur-md">
            <div className="mt-0.5 h-8 w-8 shrink-0 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div>
              <p className="font-semibold text-emerald-400 tracking-wide">Asset Reserving Initiated</p>
              <p className="text-sm text-slate-300 mt-1">Escrow wire instructions have been dispatched securely to your registered email.</p>
            </div>
            <button 
              onClick={() => setShowToast(false)}
              className="ml-2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
