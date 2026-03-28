"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  quality_score: number;
  status: string;
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const q = query(collection(db, "empathy_leads"), orderBy("quality_score", "desc"));
        const querySnapshot = await getDocs(q);
        const leadsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Lead[];
        setLeads(leadsData);
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex justify-between items-end border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-white mb-2">
              Empathy Manor
            </h1>
            <p className="text-sm text-gray-400 uppercase tracking-widest">
              Investor Leads Dashboard
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              Total Leads
            </span>
            <p className="text-2xl font-light">{leads.length}</p>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex space-x-4">
              <div className="h-3 w-3 bg-gray-600 rounded-full"></div>
              <div className="h-3 w-3 bg-gray-600 rounded-full"></div>
              <div className="h-3 w-3 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        ) : (
          <div className="bg-[#111111] rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1a1a1a] border-b border-gray-800 text-xs uppercase tracking-wider text-gray-400">
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Company</th>
                    <th className="p-4 font-medium">Score</th>
                    <th className="p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-[#161616] transition-colors group"
                    >
                      <td className="p-4">
                        <div className="font-medium text-gray-200">
                          {lead.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {lead.email}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-300">
                        {lead.company || "—"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <span
                            className={`text-sm font-mono ${
                              lead.quality_score >= 80
                                ? "text-emerald-400"
                                : lead.quality_score >= 50
                                ? "text-amber-400"
                                : "text-rose-400"
                            }`}
                          >
                            {lead.quality_score}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            lead.status === "Hot"
                              ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                              : lead.status === "Warm"
                              ? "bg-amber-400/10 text-amber-400 border-amber-400/20"
                              : "bg-gray-800 text-gray-300 border-gray-700"
                          }`}
                        >
                          {lead.status || "New"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-8 text-center text-gray-500 text-sm"
                      >
                        No leads found in the database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
