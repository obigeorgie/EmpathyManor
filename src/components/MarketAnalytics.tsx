import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Sparkles, Zap, TrendingUp, Search, Filter, Building, CheckSquare, Square, Scale, X, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getGeminiResponse } from '../services/gemini';
import { cn } from '@/src/lib/utils';

const chartData = [
  { name: 'Apartment', entry: 80, rent: 5 },
  { name: 'Duplex', entry: 250, rent: 10 },
  { name: 'Mansion', entry: 400, rent: 15 },
];

const propertiesData = [
  { id: 1, name: 'Luxury 3BR Apartment - Lekki', type: 'Apartment', price: 80, yield: 6.5, rent: 5.2, image: 'https://picsum.photos/seed/lekki/400/250', video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
  { id: 2, name: 'Semi-Detached Duplex - Ikoyi', type: 'Duplex', price: 250, yield: 8.0, rent: 20, image: 'https://picsum.photos/seed/ikoyi/400/250' },
  { id: 3, name: 'Signature Mansion - Banana Island', type: 'Mansion', price: 850, yield: 5.5, rent: 46.75, video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
  { id: 4, name: '2BR Investment Condo - Victoria Island', type: 'Apartment', price: 120, yield: 7.5, rent: 9, image: 'https://picsum.photos/seed/vi/400/250' },
  { id: 5, name: '4BR Terraced Duplex - Abuja', type: 'Duplex', price: 180, yield: 9.0, rent: 16.2, video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
  { id: 6, name: 'Premium 5BR Villa - Maitama', type: 'Mansion', price: 600, yield: 6.0, rent: 36, image: 'https://picsum.photos/seed/maitama/400/250' },
];

export default function MarketAnalytics() {
  const [vibeCheck, setVibeCheck] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [minYield, setMinYield] = useState('all');
  
  // Compare State
  const [compareList, setCompareList] = useState<number[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Video Modal State
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const toggleCompare = (id: number) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(pId => pId !== id);
      if (prev.length >= 4) return prev; // Limit to 4 properties for comparison
      return [...prev, id];
    });
  };

  const filteredProperties = propertiesData.filter(prop => {
    const matchesSearch = prop.name.toLowerCase().includes(searchTerm.toLowerCase()) || prop.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesPrice = true;
    if (priceRange === '0-100') matchesPrice = prop.price <= 100;
    else if (priceRange === '100-300') matchesPrice = prop.price > 100 && prop.price <= 300;
    else if (priceRange === '300+') matchesPrice = prop.price > 300;

    let matchesYield = true;
    if (minYield !== 'all') matchesYield = prop.yield >= Number(minYield);

    return matchesSearch && matchesPrice && matchesYield;
  });

  const handleVibeCheck = async () => {
    setIsLoading(true);
    const prompt = `Current FX Rate: 1610 NGN/USD. Property Yield: 8%+. Write a professional, 2-sentence market insight for a US-based diaspora investor looking at Nigerian real estate, highlighting the currency advantage and rental yield.`;
    const response = await getGeminiResponse(prompt, "You are a professional real estate investment advisor.");
    setVibeCheck(response);
    setIsLoading(false);
  };

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-serif font-bold text-slate-900">Market Data Analytics</h2>
        <p className="text-slate-500 mt-2">Visualizing investment potential and rental yields.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Investment Tiers (₦ Millions)
          </h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="entry" name="Entry Cost" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar dataKey="rent" name="Annual Rent" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold flex items-center gap-2 text-emerald-400">
                <Zap className="w-4 h-4" />
                AI Market Insights
              </h3>
              <span className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded-lg uppercase tracking-widest">
                Real-Time
              </span>
            </div>

            <div className={cn(
              "text-sm text-slate-300 italic leading-relaxed min-h-[80px]",
              isLoading && "loading-shimmer rounded-lg"
            )}>
              {isLoading ? "" : (vibeCheck || "Press analyze for a professional sentiment check on current FX rates vs property entries...")}
            </div>

            <button 
              onClick={handleVibeCheck}
              disabled={isLoading}
              className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3 h-3" />
              {isLoading ? "Analyzing..." : "Run Analysis"}
            </button>
          </motion.div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="font-bold text-xs uppercase text-slate-400 mb-6 tracking-[0.2em]">Property Benchmarks</h3>
            <div className="space-y-4">
              {[
                { label: "Apts (3BR)", price: "₦30M - ₦80M" },
                { label: "Duplex (Semi)", price: "₦80M - ₦250M" },
                { label: "Mansion (Detached)", price: "₦400M+" }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                  <span className="text-sm text-slate-600 font-medium">{item.label}</span>
                  <span className="text-sm font-bold text-emerald-700">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Property Search & Filter Section */}
      <div className="mt-12 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-slate-900">Property Directory</h3>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search properties by name or location..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
          <div className="w-full md:w-48 relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={priceRange} 
              onChange={e => setPriceRange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all appearance-none"
            >
              <option value="all">Any Price</option>
              <option value="0-100">Under ₦100M</option>
              <option value="100-300">₦100M - ₦300M</option>
              <option value="300+">Above ₦300M</option>
            </select>
          </div>
          <div className="w-full md:w-48 relative">
            <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={minYield} 
              onChange={e => setMinYield(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all appearance-none"
            >
              <option value="all">Any Yield</option>
              <option value="6">6%+ Yield</option>
              <option value="8">8%+ Yield</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map(prop => (
              <motion.div 
                key={prop.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
              >
                <div className="h-48 w-full relative bg-slate-100">
                  <img 
                    src={prop.image || `https://picsum.photos/seed/placeholder${prop.id}/400/250`} 
                    alt={prop.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {prop.video && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <button 
                        onClick={() => setActiveVideo(prop.video as string)}
                        className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all pointer-events-auto"
                      >
                        <Play className="w-5 h-5 text-emerald-600 ml-1" />
                      </button>
                    </div>
                  )}
                  <button 
                    onClick={() => toggleCompare(prop.id)}
                    className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-sm hover:bg-white transition-colors z-10"
                    title={compareList.includes(prop.id) ? "Remove from comparison" : "Add to comparison"}
                  >
                    {compareList.includes(prop.id) ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  <div className="absolute top-4 right-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                      {prop.type}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h4 className="font-bold text-slate-900 mb-6 line-clamp-2 min-h-[48px]">{prop.name}</h4>
                  <div className="space-y-3 mt-auto">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                      <span className="text-sm text-slate-500">Entry Price</span>
                      <span className="font-bold text-slate-900">₦{prop.price}M</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                      <span className="text-sm text-slate-500">Annual Rent</span>
                      <span className="font-bold text-slate-900">₦{prop.rent}M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">Est. Yield</span>
                      <span className="font-bold text-emerald-600">{prop.yield}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-[2rem] border border-slate-100 border-dashed">
              No properties found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {/* Compare Floating Bar */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 z-40 border border-slate-700"
          >
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-emerald-400" />
              <span className="font-medium whitespace-nowrap">{compareList.length} selected</span>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowCompareModal(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
              >
                Compare
              </button>
              <button 
                onClick={() => setCompareList([])}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm transition-colors"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <AnimatePresence>
        {showCompareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
              onClick={() => setShowCompareModal(false)} 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-emerald-600" />
                  Property Comparison
                </h3>
                <button onClick={() => setShowCompareModal(false)} className="p-2 hover:bg-slate-200 bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-6 overflow-x-auto">
                <div className="min-w-max flex gap-6">
                  {propertiesData.filter(p => compareList.includes(p.id)).map(prop => (
                    <div key={prop.id} className="w-72 border border-slate-100 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                      <div className="h-32 bg-slate-100 relative">
                         <img src={prop.image || `https://picsum.photos/seed/placeholder${prop.id}/400/250`} alt={prop.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                         <div className="absolute top-3 right-3">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50/95 backdrop-blur-md px-2 py-1 rounded-full shadow-sm">
                             {prop.type}
                           </span>
                         </div>
                      </div>
                      <div className="p-5 space-y-4">
                        <h4 className="font-bold text-slate-900 line-clamp-2 h-10">{prop.name}</h4>
                        <div className="space-y-3">
                          <div className="bg-slate-50 p-3 rounded-xl">
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Entry Price</p>
                            <p className="font-bold text-lg text-slate-900">₦{prop.price}M</p>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl">
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Annual Rent</p>
                            <p className="font-bold text-lg text-slate-900">₦{prop.rent}M</p>
                          </div>
                          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                            <p className="text-[10px] text-emerald-600 uppercase tracking-wider mb-1 font-bold">Est. Yield</p>
                            <p className="font-bold text-xl text-emerald-700">{prop.yield}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" 
              onClick={() => setActiveVideo(null)} 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-black w-full max-w-5xl aspect-video rounded-[2rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <button 
                onClick={() => setActiveVideo(null)} 
                className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>
              <video 
                src={activeVideo} 
                className="w-full h-full object-contain bg-black"
                controls
                autoPlay
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
