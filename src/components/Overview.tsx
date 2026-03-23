import React, { useState } from 'react';
import { ShieldCheck, Volume2, Users, Building2, MapPin, MessageCircle, User, Mail, Star, Quote, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';
import { generateSpeech, playAudioBuffer } from '../services/gemini';

export default function Overview() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [budget, setBudget] = useState('');
  const [interest, setInterest] = useState('Premium Apartment');

  const budgetNum = Number(budget);
  const isQualified = budgetNum >= 50000;
  const hasBudget = budget !== '';

  const handleListen = async () => {
    setIsSpeaking(true);
    const text = "Welcome to Empathy Manor. We provide secure, high-yield real estate investment opportunities across Nigeria's most premium gated communities. Maximize your foreign exchange advantage with end-to-end property management and verified legal titles.";
    const buffer = await generateSpeech(text);
    if (buffer) {
      await playAudioBuffer(buffer);
    }
    setIsSpeaking(false);
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = "1234567890"; // Placeholder phone number
    let message = "Hello Empathy Manor, I am interested in learning more about your premium real estate investment opportunities.";
    
    if (name || email || budget || interest) {
      message += `\n\nMy details:\n`;
      if (name) message += `Name: ${name}\n`;
      if (email) message += `Email: ${email}\n`;
      if (budget) message += `Budget: $${budget}\n`;
      if (interest) message += `Interested In: ${interest}\n`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const testimonials = [
    {
      name: "Dr. Adebayo O.",
      location: "Houston, TX",
      image: "https://picsum.photos/seed/adebayo/100/100",
      story: "Empathy Manor made investing from the US completely frictionless. The property management team handles everything, and my rental yield has consistently exceeded 8% annually."
    },
    {
      name: "Sarah & Michael T.",
      location: "London, UK",
      image: "https://picsum.photos/seed/sarah/100/100",
      story: "We were hesitant about remote real estate, but the verified legal titles and secure estate zoning gave us peace of mind. We just acquired our second luxury duplex."
    }
  ];

  return (
    <div className="space-y-12">
      <header className="space-y-6">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight"
        >
          Remote Real Estate <br />
          <span className="text-emerald-700 italic">Opportunities</span>
        </motion.h2>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Empathy Manor provides exclusive access to Nigeria's most prestigious gated communities. For diaspora investors, it represents a stable asset class where USD buying power is currently maximized by favorable exchange rates.
          </p>
          <button 
            onClick={handleListen}
            disabled={isSpeaking}
            className="flex-shrink-0 bg-emerald-100 text-emerald-800 px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-emerald-200 transition-all active:scale-95 disabled:opacity-50"
          >
            <Volume2 className={cn("w-4 h-4", isSpeaking && "animate-pulse")} />
            {isSpeaking ? "Generating Audio..." : "Listen to Summary"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100 space-y-6"
        >
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Verified Secure Estates</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Premium Estate Associations ensure your property value appreciates by maintaining strict residential zoning and security protocols.
            </p>
          </div>
          
          <div className="space-y-3">
            {[
              { icon: MapPin, text: "Serene Environments", color: "text-emerald-500" },
              { icon: Building2, text: "Strict Residential Zoning", color: "text-slate-400" },
              { icon: Users, text: "Access Control & Security", color: "text-emerald-500" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                <item.icon className={cn("w-4 h-4", item.color)} />
                <span className="font-medium text-slate-700">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-emerald-900 text-emerald-50 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Users className="w-32 h-32" />
          </div>
          
          <div className="space-y-6 relative z-10">
            <h3 className="text-xl font-bold text-emerald-400">Seamless Remote Investing</h3>
            <p className="text-emerald-100/80 leading-relaxed">
              Invest with confidence from anywhere in the world. We provide end-to-end property management, legal verification, and transparent reporting, giving you peace of mind and passive income.
            </p>
          </div>

          <div className="mt-12 bg-emerald-950/50 p-6 rounded-2xl border border-emerald-800/50 relative z-10">
            <p className="text-[10px] uppercase font-bold text-emerald-500 mb-2 tracking-widest italic">Yield Analysis</p>
            <p className="text-2xl font-serif font-bold text-white">₦2.5M - ₦10M+</p>
            <p className="text-xs text-emerald-400/60 mt-1">Annual Rental Income</p>
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <div className="space-y-6 md:col-span-2 mt-4">
          <div className="text-center space-y-2 mb-8">
            <h3 className="text-2xl font-serif font-bold text-slate-900">Investor Success Stories</h3>
            <p className="text-sm text-slate-500">Join hundreds of diaspora investors securing their wealth.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative"
              >
                <Quote className="absolute top-8 right-8 w-8 h-8 text-emerald-100" />
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={t.image} 
                    alt={t.name} 
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full object-cover border-2 border-emerald-50"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">{t.name}</h4>
                    <p className="text-xs text-emerald-600 font-medium">{t.location}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-emerald-400 text-emerald-400" />)}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">"{t.story}"</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Lead Capture & WhatsApp Integration */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100 space-y-8 md:col-span-2"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Connect with an Advisor</h3>
              <p className="text-sm text-slate-500">Get personalized guidance via WhatsApp</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Your Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Your Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">USD Budget</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="number" 
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="50000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Property Interest</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select 
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all appearance-none"
                >
                  <option value="Premium Apartment">Premium Apartment</option>
                  <option value="Luxury Duplex">Luxury Duplex</option>
                  <option value="Signature Mansion">Signature Mansion</option>
                </select>
              </div>
            </div>
          </div>
          
          {hasBudget && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-4 rounded-xl text-sm font-medium border",
                isQualified 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                  : "bg-amber-50 text-amber-700 border-amber-200"
              )}
            >
              {isQualified
                ? "✨ You qualify for our premium investor tier! Connect with an advisor to view exclusive listings."
                : "Our premium estates typically require a minimum investment of $50,000. You can still reach out to discuss upcoming starter opportunities."}
            </motion.div>
          )}

          <button 
            onClick={handleWhatsAppClick}
            className="w-full md:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#25D366]/20 active:scale-95"
          >
            <MessageCircle className="w-5 h-5" />
            Chat on WhatsApp
          </button>
        </motion.div>
      </div>
    </div>
  );
}

import { cn } from '@/src/lib/utils';
