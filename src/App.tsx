import React, { useState, useEffect } from 'react';
import { 
  TreePine, 
  LineChart, 
  Calculator, 
  ShieldCheck, 
  Volume2, 
  CircleCheck,
  Menu,
  X,
  Landmark,
  Plug
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import Overview from './components/Overview';
import MarketAnalytics from './components/MarketAnalytics';
import ROICalculator from './components/ROICalculator';
import OpenClawBridge from './components/OpenClawBridge';

type Tab = 'overview' | 'market' | 'calculator' | 'openclaw';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Estate Overview', icon: TreePine },
    { id: 'market', label: 'Market Analytics', icon: LineChart },
    { id: 'calculator', label: 'ROI Calculator', icon: Calculator },
  ] as const;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-cream selection:bg-emerald-200">
      {/* Mobile Header */}
      <div className="md:hidden bg-emerald-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-400 rounded-lg flex items-center justify-center">
            <Landmark className="w-5 h-5 text-emerald-900" />
          </div>
          <span className="font-serif font-bold">EMPATHY MANOR</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-emerald-900 text-emerald-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col shadow-2xl",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-400/20">
            <Landmark className="w-6 h-6 text-emerald-900" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold tracking-tight">EMPATHY</h1>
            <p className="text-[10px] text-emerald-300 uppercase tracking-[0.2em] font-bold">Manor Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                activeTab === item.id 
                  ? "bg-emerald-400 text-emerald-950 shadow-lg shadow-emerald-400/10" 
                  : "text-emerald-200 hover:bg-emerald-800 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                activeTab === item.id ? "text-emerald-950" : "text-emerald-400 group-hover:text-white"
              )} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-emerald-950/50 p-5 rounded-2xl border border-emerald-800/50 backdrop-blur-sm">
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-2">Current Exchange Rate</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-mono font-bold text-white">₦1,610</span>
              <span className="text-xs text-emerald-400">/ $1</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[10px] text-emerald-500/80">
              <CircleCheck className="w-3 h-3" />
              Verified Market Rate
            </div>
          </div>
          
          <button 
            onClick={() => {
              setActiveTab('openclaw');
              setIsSidebarOpen(false);
            }}
            className="mt-4 w-full text-center text-[10px] text-emerald-800 hover:text-emerald-600 transition-colors uppercase tracking-widest font-bold"
          >
            Admin Portal
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 lg:p-16 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl mx-auto"
          >
            {activeTab === 'overview' && <Overview />}
            {activeTab === 'market' && <MarketAnalytics />}
            {activeTab === 'calculator' && <ROICalculator />}
            {activeTab === 'openclaw' && <OpenClawBridge />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
