"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";

interface Lead {
  name: string;
  email: string;
  company: string;
}

export default function DealRoom() {
  const params = useParams();
  const leadId = params.leadId as string;
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    async function fetchLead() {
      if (!leadId) return;
      try {
        const docRef = doc(db, "empathy_leads", leadId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLead(docSnap.data() as Lead);
        }
      } catch (error) {
        console.error("Error fetching lead:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLead();
  }, [leadId]);

  const handleRequestEscrow = () => {
    setRequesting(true);
    // Simulate API call
    setTimeout(() => {
      setRequesting(false);
      setRequested(true);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex justify-center items-center">
        <div className="animate-pulse text-gray-500 text-sm tracking-widest uppercase">
          Loading Deal Room...
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-[#050505] flex justify-center items-center text-gray-400">
        Deal Room not found or access denied.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-amber-900/30">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-serif tracking-wide text-white">
            Empathy Manor
          </div>
          <div className="text-xs tracking-widest uppercase text-gray-500">
            Secure Deal Room
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Property Details */}
        <div className="lg:col-span-7 space-y-12">
          <div>
            <div className="inline-block px-3 py-1 border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs tracking-widest uppercase rounded-full mb-6">
              Exclusive Allocation
            </div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white leading-tight mb-6">
              Magodo GRA Phase 2<br />
              <span className="text-gray-400">Luxury Duplex</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed font-light">
              Welcome, {lead.name.split(" ")[0]}. Based on your profile at {lead.company || "your firm"}, 
              we have curated this off-market opportunity. This premium asset offers immediate 
              cash flow and long-term appreciation in one of Lagos's most secure and sought-after enclaves.
            </p>
          </div>

          <div className="aspect-[16/9] bg-[#111] rounded-2xl overflow-hidden border border-white/10 relative group">
            {/* Placeholder for Property Image/Video */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
            <img 
              src="https://picsum.photos/seed/luxuryhome/1200/800" 
              alt="Magodo Luxury Duplex" 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-6 left-6 z-20">
              <p className="text-white font-medium tracking-wide">Exterior View</p>
              <p className="text-xs text-gray-400 tracking-wider uppercase mt-1">Artist Impression</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/10 pt-12">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Location</p>
              <p className="text-white font-medium">Magodo Phase 2</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Type</p>
              <p className="text-white font-medium">5 Bed Detached</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Completion</p>
              <p className="text-white font-medium">Q4 2026</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Title</p>
              <p className="text-white font-medium">C of O</p>
            </div>
          </div>
        </div>

        {/* Right Column: Financials & Action */}
        <div className="lg:col-span-5">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 sticky top-32">
            <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-8">Investment Summary</h3>
            
            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <span className="text-gray-400 font-light">Asset Valuation</span>
                <span className="text-2xl text-white font-light">₦250,000,000</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <span className="text-gray-400 font-light">Projected Annual Yield</span>
                <span className="text-2xl text-emerald-400 font-light">₦10,000,000</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <span className="text-gray-400 font-light">Yield Percentage</span>
                <span className="text-xl text-white font-light">4.0% Net</span>
              </div>
            </div>

            <div className="bg-black/40 rounded-xl p-5 mb-8 border border-white/5">
              <p className="text-sm text-gray-400 leading-relaxed">
                This allocation is reserved for <strong className="text-white font-medium">{lead.name}</strong>. 
                Escrow details will be provided securely upon request.
              </p>
            </div>

            <button
              onClick={handleRequestEscrow}
              disabled={requested || requesting}
              className={`w-full py-4 px-6 rounded-xl font-medium tracking-wide transition-all duration-300 ${
                requested 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              {requesting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : requested ? (
                "Request Received"
              ) : (
                "Request Escrow Details"
              )}
            </button>
            
            {requested && (
              <p className="text-xs text-center text-gray-500 mt-4">
                Our private wealth team will contact you shortly.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
