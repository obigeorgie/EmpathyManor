import React, { useState, useEffect } from 'react';
import { Calculator, FileText, ArrowRight, Building2, Home, Castle, X, Landmark, Percent, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { getGeminiResponse } from '../services/gemini';
import { PROPERTY_TIERS, FX_RATE } from '../constants';
import { cn } from '@/src/lib/utils';
import confetti from 'canvas-confetti';

export default function ROICalculator() {
  const [usdBudget, setUsdBudget] = useState(50000);
  const [ngnValue, setNgnValue] = useState(50000 * FX_RATE);
  const [memo, setMemo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mortgage Calculator State
  const [propertyPrice, setPropertyPrice] = useState(100000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(7.5);
  const [loanTermYears, setLoanTermYears] = useState(15);

  const downPaymentAbs = propertyPrice * (downPaymentPct / 100);
  const principal = propertyPrice - downPaymentAbs;
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTermYears * 12;
  
  const rawMonthlyPayment = monthlyRate === 0 
    ? (numPayments === 0 ? 0 : principal / numPayments)
    : principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  const monthlyPayment = isNaN(rawMonthlyPayment) || !isFinite(rawMonthlyPayment) ? 0 : rawMonthlyPayment;

  // Investment Projection State
  const [invInitial, setInvInitial] = useState(100000);
  const [invYield, setInvYield] = useState(8);
  const [invAppreciation, setInvAppreciation] = useState(5);
  const [invPeriod, setInvPeriod] = useState(10);

  // Investment Projection Calculations
  const futureValue = invInitial * Math.pow(1 + invAppreciation / 100, invPeriod);
  const totalAppreciation = futureValue - invInitial;
  
  let totalRent = 0;
  let currentPropValue = invInitial;
  for (let i = 0; i < invPeriod; i++) {
    totalRent += currentPropValue * (invYield / 100);
    currentPropValue *= (1 + invAppreciation / 100);
  }
  
  const totalReturn = totalAppreciation + totalRent;
  const totalValueWithRent = invInitial + totalReturn;

  useEffect(() => {
    setNgnValue(usdBudget * FX_RATE);
  }, [usdBudget]);

  const handleGenerateMemo = async () => {
    setIsLoading(true);
    const prompt = `Write a professional Real Estate Investment Proposal for $${usdBudget} USD (₦${ngnValue.toLocaleString()}) targeting premium Nigerian real estate. Focus on the currency advantage, expected rental yields, and secure gated communities. Use markdown headers.`;
    const response = await getGeminiResponse(prompt, "You are a Senior Investment Advisor specializing in Nigerian real estate for diaspora clients.");
    setMemo(response);
    setIsLoading(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#064e3b', '#fdfbf7']
    });
  };

  const matches = [...PROPERTY_TIERS].filter(t => ngnValue >= t.min).reverse();

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-serif font-bold text-slate-900">ROI & Yield Calculator</h2>
        <p className="text-slate-500 mt-2">Calculate your buying power and generate personalized investment proposals.</p>
      </header>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="md:col-span-2 bg-slate-900 p-10 text-white space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase text-slate-400 block tracking-[0.2em]">
                Investment Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-2xl">$</span>
                <input 
                  type="number" 
                  value={usdBudget}
                  onChange={(e) => setUsdBudget(Number(e.target.value))}
                  className="w-full bg-slate-800 border-2 border-slate-700 text-3xl font-bold rounded-2xl p-5 pl-10 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                <span>Rate: ₦{FX_RATE} / $1</span>
                <span className="text-emerald-500">High Buying Power</span>
              </div>
            </div>

            <button 
              onClick={handleGenerateMemo}
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-900/40 active:scale-95 disabled:opacity-50"
            >
              <FileText className="w-5 h-5" />
              {isLoading ? "Drafting Proposal..." : "Generate Investment Proposal"}
            </button>
          </div>

          <div className="md:col-span-3 p-10 space-y-8">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]">Local Value (NGN)</p>
              <div className="text-5xl md:text-6xl font-serif font-bold text-slate-900">
                ₦{ngnValue.toLocaleString()}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-400 text-xs uppercase tracking-widest flex items-center gap-2">
                Property Matches
                <div className="h-px flex-1 bg-slate-100" />
              </h4>
              
              <div className="space-y-3">
                {matches.length > 0 ? (
                  matches.map((tier, i) => (
                    <motion.div 
                      key={tier.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={cn(
                        "p-5 rounded-2xl border flex items-center justify-between group transition-all",
                        i === 0 ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-100"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                          i === 0 ? "bg-emerald-600 text-white" : "bg-white text-slate-400"
                        )}>
                          {tier.icon === 'Building2' && <Building2 className="w-5 h-5" />}
                          {tier.icon === 'Home' && <Home className="w-5 h-5" />}
                          {tier.icon === 'Castle' && <Castle className="w-5 h-5" />}
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-900 text-sm">{tier.title}</h5>
                          <p className="text-[10px] text-slate-500 font-medium">Avg. Yield: {tier.yield}</p>
                        </div>
                      </div>
                      {i === 0 && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-widest">
                          Best Match
                        </span>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-400 italic text-sm">
                    Adjust budget to see property tiers...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {memo && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white p-10 rounded-[2.5rem] border border-emerald-100 shadow-2xl relative"
          >
            <button 
              onClick={() => setMemo(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-emerald-900 prose-p:text-slate-600 prose-strong:text-emerald-700">
              <ReactMarkdown>{memo}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mortgage Estimator Section */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden mt-8">
        <div className="p-10 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-slate-900">Mortgage Estimator</h3>
            <p className="text-slate-500 text-sm">Calculate your estimated monthly payments.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          <div className="p-10 space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-400" />
                Property Value (USD)
              </label>
              <input 
                type="number" 
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="w-full bg-slate-50 border-2 border-slate-200 text-xl font-bold rounded-xl p-4 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                  <Percent className="w-4 h-4 text-slate-400" />
                  Down Payment (%)
                </label>
                <input 
                  type="number" 
                  value={downPaymentPct}
                  onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                  className="w-full bg-slate-50 border-2 border-slate-200 text-xl font-bold rounded-xl p-4 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                  <Percent className="w-4 h-4 text-slate-400" />
                  Interest Rate (%)
                </label>
                <input 
                  type="number" 
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full bg-slate-50 border-2 border-slate-200 text-xl font-bold rounded-xl p-4 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                Loan Term (Years)
              </label>
              <select
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(Number(e.target.value))}
                className="w-full bg-slate-50 border-2 border-slate-200 text-xl font-bold rounded-xl p-4 focus:border-indigo-500 outline-none transition-all appearance-none"
              >
                <option value={10}>10 Years</option>
                <option value={15}>15 Years</option>
                <option value={20}>20 Years</option>
                <option value={30}>30 Years</option>
              </select>
            </div>
          </div>

          <div className="p-10 bg-indigo-900 text-white flex flex-col justify-center space-y-8">
            <div className="space-y-2">
              <p className="text-indigo-300 text-sm font-bold uppercase tracking-widest">Estimated Monthly Payment</p>
              <div className="text-5xl md:text-6xl font-serif font-bold text-white">
                ${monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <p className="text-indigo-400 text-sm mt-2">Principal & Interest only</p>
            </div>

            <div className="h-px w-full bg-indigo-800/50" />

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-wider">Principal Amount</p>
                <p className="text-xl font-bold text-white">${principal.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-wider">Down Payment</p>
                <p className="text-xl font-bold text-white">${downPaymentAbs.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Projection Section */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden mt-8">
        <div className="p-10 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-slate-900">Investment Projection</h3>
            <p className="text-slate-500 text-sm">Forecast your total returns over time.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          <div className="p-10 space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-400" />
                Initial Investment (USD)
              </label>
              <input 
                type="number" 
                value={invInitial}
                onChange={(e) => setInvInitial(Number(e.target.value))}
                className="w-full bg-slate-50 border-2 border-slate-200 text-xl font-bold rounded-xl p-4 focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                  <Percent className="w-4 h-4 text-slate-400" />
                  Annual Rental Yield
                </label>
                <input 
                  type="number" 
                  step="0.1"
                  value={invYield}
                  onChange={(e) => setInvYield(Number(e.target.value))}
                  className="w-full bg-slate-50 border-2 border-slate-200 text-xl font-bold rounded-xl p-4 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                  <Percent className="w-4 h-4 text-slate-400" />
                  Annual Appreciation
                </label>
                <input 
                  type="number" 
                  step="0.1"
                  value={invAppreciation}
                  onChange={(e) => setInvAppreciation(Number(e.target.value))}
                  className="w-full bg-slate-50 border-2 border-slate-200 text-xl font-bold rounded-xl p-4 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                Holding Period (Years)
              </label>
              <select
                value={invPeriod}
                onChange={(e) => setInvPeriod(Number(e.target.value))}
                className="w-full bg-slate-50 border-2 border-slate-200 text-xl font-bold rounded-xl p-4 focus:border-emerald-500 outline-none transition-all appearance-none"
              >
                <option value={5}>5 Years</option>
                <option value={10}>10 Years</option>
                <option value={15}>15 Years</option>
                <option value={20}>20 Years</option>
                <option value={30}>30 Years</option>
              </select>
            </div>
          </div>

          <div className="p-10 bg-emerald-900 text-white flex flex-col justify-center space-y-8">
            <div className="space-y-2">
              <p className="text-emerald-300 text-sm font-bold uppercase tracking-widest">Projected Total Value</p>
              <div className="text-5xl md:text-6xl font-serif font-bold text-white">
                ${totalValueWithRent.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <p className="text-emerald-400 text-sm mt-2">Initial + Appreciation + Rent</p>
            </div>

            <div className="h-px w-full bg-emerald-800/50" />

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-emerald-300 text-[10px] font-bold uppercase tracking-wider">Total Rental Income</p>
                <p className="text-xl font-bold text-white">+${totalRent.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="space-y-1">
                <p className="text-emerald-300 text-[10px] font-bold uppercase tracking-wider">Total Appreciation</p>
                <p className="text-xl font-bold text-white">+${totalAppreciation.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
