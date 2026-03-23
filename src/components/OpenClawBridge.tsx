import React, { useState, useEffect } from 'react';
import { Plug, Copy, CheckCircle2, Bot, MessageSquare, Zap, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { PROPERTY_TIERS } from '../constants';

export default function OpenClawBridge() {
  const [copied, setCopied] = useState(false);
  const [fxRate, setFxRate] = useState<number>(1610);
  const [isFetchingFx, setIsFetchingFx] = useState(true);

  useEffect(() => {
    const fetchFxRate = async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        if (data && data.rates && data.rates.NGN) {
          setFxRate(data.rates.NGN);
        }
      } catch (error) {
        console.error("Failed to fetch live FX rate:", error);
      } finally {
        setIsFetchingFx(false);
      }
    };

    fetchFxRate();
  }, []);

  const configYaml = `# OpenClaw Config for Empathy Manor Bot
provider: "google"
model: "gemini-3-flash-preview"
api_key: "YOUR_GEMINI_API_KEY_HERE"
skills:
  - name: "property-matcher"
    description: "Matches USD budgets to Nigerian property tiers"
    parameters:
      usd_budget: "number"
    logic: |
      const rate = ${fxRate};
      const ngn = usd_budget * rate;
      ${PROPERTY_TIERS.map(t => `if (ngn >= ${t.min}) return "${t.title} (Yield: ${t.yield})";`).join('\n      ')}
      return "Budget too low for premium tiers.";
  - name: "schedule-viewing"
    description: "Schedules a virtual or physical viewing"
    parameters:
      property_tier: "string"
      date: "string"
      client_email: "string"
system_prompt: |
  You are the Empathy Manor AI Assistant. You help diaspora investors find premium real estate in Nigeria.
  Always be professional, luxurious, and focus on security and high yields.
  Current FX Rate: ${fxRate} NGN/USD.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(configYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900">OpenClaw Integration</h2>
          <p className="text-slate-500 mt-2">Deploy your automated WhatsApp AI assistant for Empathy Manor.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold border border-emerald-100">
          {isFetchingFx ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
          <span>Live FX Rate: ₦{fxRate.toLocaleString()} / $1</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100"
          >
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
              <Bot className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">24/7 AI Agent</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Connect your WhatsApp Business number to OpenClaw. The AI will automatically qualify leads, match budgets to properties, and schedule viewings.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
            <h3 className="font-bold flex items-center gap-2 text-indigo-400 mb-4">
              <Zap className="w-4 h-4" />
              Active Skills
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <MessageSquare className="w-4 h-4 mt-0.5 text-indigo-400" />
                <span><strong>Budget Matching:</strong> Instantly converts USD to NGN and suggests properties.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <MessageSquare className="w-4 h-4 mt-0.5 text-indigo-400" />
                <span><strong>Lead Capture:</strong> Collects emails and viewing preferences automatically.</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="lg:col-span-2 bg-slate-950 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-800 flex flex-col">
          <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Plug className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-mono text-slate-300">openclaw.yml</span>
            </div>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Config"}
            </button>
          </div>
          <div className="p-6 overflow-x-auto flex-1">
            <pre className="text-sm font-mono text-indigo-300 leading-relaxed">
              <code>{configYaml}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
