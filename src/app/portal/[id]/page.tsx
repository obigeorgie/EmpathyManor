'use client';

import { useState, useEffect, use } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface PropertyData {
  id: string;
  title?: string;
  location?: string;
  asking_price_ngn: number;
}

export default function PortalPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const propertyId = resolvedParams.id;

  // Task 2: State Management additions
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Task 2: State Variables for User Inputs
  const [exchangeRate, setExchangeRate] = useState<number>(1378);
  const [annualRent, setAnnualRent] = useState<number>(12000);
  const [renovationCosts, setRenovationCosts] = useState<number>(10000);

  // Task 3: The Fetch Logic Hook
  useEffect(() => {
    async function fetchProperty() {
      setIsLoading(true);
      try {
        const docRef = doc(db, 'properties', propertyId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPropertyData({ 
            id: docSnap.id, 
            ...(docSnap.data() as Omit<PropertyData, 'id'>) 
          });
        } else {
          setPropertyData(null);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        setPropertyData(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  // Helper for formatting currencies
  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleReserve = () => {
    alert('Reservation request sent to Managing Partner.');
  };

  // Dynamic UI Loading Block
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans tracking-wide">
        <div className="w-16 h-16 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_20px_rgba(16,185,129,0.3)]"></div>
        <p className="text-emerald-500 font-bold mt-6 animate-pulse uppercase text-sm">
          Unlocking Vault Artifacts...
        </p>
      </div>
    );
  }

  // Dynamic UI 404 / Missing Logic Block
  if (!propertyData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans p-6 text-center">
        <div className="bg-slate-900/40 backdrop-blur-md p-10 rounded-3xl border border-slate-800 shadow-2xl max-w-lg w-full">
          <div className="w-20 h-20 bg-slate-800/80 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-white text-3xl font-bold mb-3 tracking-tight">Deal Not Found</h2>
          <p className="text-slate-400 mb-8 font-medium">The escrow packet or asset profile associated with the identifier <span className="text-emerald-400 font-mono tracking-wider">{propertyId}</span> could not be securely located.</p>
          <button className="bg-slate-800/80 text-white border border-slate-700 w-full py-4 rounded-xl hover:bg-slate-700 transition-all font-bold tracking-wide uppercase text-sm">
            Retract to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Task 4: Dynamic Base Mathematics Mapping
  const askingPriceNGN = propertyData.asking_price_ngn || 0;
  const propertyName = propertyData.title || propertyData.location || "Confidential Asset Portfolio";

  // Task 2: Exact Derived Variables Computation
  const usdAcquisitionCost = (askingPriceNGN / exchangeRate) + renovationCosts;
  const cashOnCashROI = usdAcquisitionCost > 0 ? (annualRent / usdAcquisitionCost) * 100 : 0;

  // Task 1: Premium Dark-Mode Aesthetic with Glassmorphism UI Elements
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Task 3 & 4: Dynamics Header with Placeholder Image */}
        <header className="space-y-6">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2">
            {propertyName}
          </h1>
          <p className="text-slate-400 font-medium tracking-wide">Deal ID: <span className="font-mono text-emerald-500/80">{propertyId}</span></p>
          
          <div className="w-full h-64 md:h-96 bg-slate-800 animate-pulse rounded-2xl flex items-center justify-center border border-slate-700/50 overflow-hidden relative">
            {/* Visual placeholder background elements */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-transparent"></div>
            <span className="text-slate-500 relative z-10 font-bold uppercase tracking-widest text-sm flex gap-3 items-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Awaiting Visual Assets
            </span>
          </div>
        </header>

        {/* Task 3: Calculator Section (Grid Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Column (Inputs) */}
          <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl p-8 border border-slate-800/80 shadow-2xl space-y-8">
            <h2 className="text-2xl font-semibold mb-6 text-slate-200 border-b border-slate-800/80 pb-4 flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
              Financial Assumptions
            </h2>

            <div className="space-y-8">
              {/* Slider: Exchange Rate */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label htmlFor="exchangeRate" className="text-sm font-semibold text-slate-400 tracking-wide uppercase">
                    FX Exchange Rate <span className="font-normal lowercase text-slate-500">(ngn/usd)</span>
                  </label>
                  <span className="text-emerald-400 font-mono font-medium bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                    ₦{exchangeRate}
                  </span>
                </div>
                <input 
                  id="exchangeRate"
                  type="range" 
                  min="800" 
                  max="2000" 
                  step="10"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 transition-all hover:accent-emerald-400"
                />
              </div>

              {/* Slider: Annual Rent */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label htmlFor="annualRent" className="text-sm font-semibold text-slate-400 tracking-wide uppercase">
                    Projected Annual Rent <span className="font-normal lowercase text-slate-500">(usd)</span>
                  </label>
                  <span className="text-emerald-400 font-mono font-medium bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                    {formatCurrency(annualRent, 'USD')}
                  </span>
                </div>
                <input 
                  id="annualRent"
                  type="range" 
                  min="5000" 
                  max="30000" 
                  step="500"
                  value={annualRent}
                  onChange={(e) => setAnnualRent(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 transition-all hover:accent-emerald-400"
                />
              </div>

              {/* Slider: Renovation Costs */}
              <div>
                <div className="flex justify-between items-center mb-4 border-t border-slate-800/80 pt-6">
                  <label htmlFor="renovationCosts" className="text-sm font-semibold text-slate-400 tracking-wide uppercase">
                    Renovation & Soft Costs <span className="font-normal lowercase text-slate-500">(usd)</span>
                  </label>
                  <span className="text-emerald-400 font-mono font-medium bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                    {formatCurrency(renovationCosts, 'USD')}
                  </span>
                </div>
                <input 
                  id="renovationCosts"
                  type="range" 
                  min="0" 
                  max="50000" 
                  step="1000"
                  value={renovationCosts}
                  onChange={(e) => setRenovationCosts(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 transition-all hover:accent-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Right Column (Outputs & CTA) */}
          <div className="flex flex-col gap-6">
            
            {/* Metric Card: Total USD Cost */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-emerald-500 transition-opacity group-hover:opacity-10 duration-500">
                <svg className="w-32 h-32 transform translate-x-4 -translate-y-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2 relative z-10">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                Total USD Cost
              </h3>
              <div className="text-5xl sm:text-6xl font-black text-white tracking-tight relative z-10 font-mono">
                {formatCurrency(usdAcquisitionCost, 'USD')}
              </div>
              <p className="text-xs text-slate-500 mt-4 relative z-10 uppercase font-bold tracking-widest">
                Base Asset (₦{askingPriceNGN.toLocaleString()}) + Renovations
              </p>
            </div>

            {/* Metric Card: Cash-on-Cash ROI */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.05)] relative overflow-hidden flex-grow flex flex-col justify-center">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2 relative z-10">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)] animate-pulse"></div>
                Projected Yield (CoC)
              </h3>
              <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200 drop-shadow-sm filter drop-shadow-[0_0_20px_rgba(52,211,153,0.2)] font-mono relative z-10">
                {cashOnCashROI.toFixed(1)}%
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleReserve}
              className="mt-2 w-full relative overflow-hidden rounded-xl bg-emerald-600 px-6 py-6 text-center font-bold text-white shadow-[0_0_20px_rgba(5,150,105,0.4)] transition-all hover:bg-emerald-500 hover:shadow-[0_0_30px_rgba(5,150,105,0.6)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] text-lg uppercase tracking-widest"
            >
              Reserve Asset & Request Escrow Instructions
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
