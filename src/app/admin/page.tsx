"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase"; // Adjust path if your firebase.js/ts is elsewhere
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Login Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Leads Data State
  const [leads, setLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  // 1. Listen for Authentication State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);

      // If logged in, fetch the leads
      if (currentUser) {
        fetchLeads();
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Leads from Firestore
  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const q = query(collection(db, "empathy_leads"), orderBy("quality_score", "desc"));
      const querySnapshot = await getDocs(q);
      const leadsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLeads(leadsData);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoadingLeads(false);
    }
  };

  // 3. Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // fetchLeads will be triggered by the auth state listener
    } catch (error: any) {
      setAuthError("Invalid email or password. Access denied.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 4. Handle Logout
  const handleLogout = async () => {
    await signOut(auth);
    setLeads([]); // Clear data from memory
  };

  // Render: Loading State
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render: Unauthenticated (The Vault Door)
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-white tracking-tight">Empathy Manor</h1>
            <p className="text-neutral-400 text-sm mt-2">Restricted Access. Authorized personnel only.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="admin@empathymanor.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm text-center">{authError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoggingIn ? "Authenticating..." : "Unlock Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render: Authenticated (The CRM)
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800">
          <div>
            <h1 className="text-2xl font-semibold">Deal Pipeline</h1>
            <p className="text-neutral-400 text-sm mt-1">Logged in as: {user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Leads Table */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-900 border-b border-neutral-800 text-xs uppercase tracking-wider text-neutral-400">
                  <th className="p-4 font-medium">Lead Name</th>
                  <th className="p-4 font-medium">Company</th>
                  <th className="p-4 font-medium">Quality Score</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {loadingLeads ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-neutral-500">Loading pipeline data...</td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-neutral-500">No leads found in database.</td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-neutral-800/20 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-neutral-200">{lead.name || "Unknown"}</div>
                        <div className="text-xs text-neutral-500">{lead.contact || lead.email || "No email"}</div>
                      </td>
                      <td className="p-4 text-neutral-300">{lead.company || "-"}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-neutral-800 rounded-full h-1.5 max-w-[60px]">
                            <div
                              className={`h-1.5 rounded-full ${lead.quality_score >= 8 ? 'bg-emerald-500' : lead.quality_score >= 5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${(lead.quality_score / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{lead.quality_score}/10</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${lead.status === 'New' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            lead.status === 'Drafted' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                              lead.status === 'Meeting Booked' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                'bg-neutral-800 text-neutral-300 border-neutral-700'
                          }`}>
                          {lead.status || "Unknown"}
                        </span>
                      </td>
                      <td className="p-4">
                        <a
                          href={`/portal/${lead.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-500 hover:text-emerald-400 text-sm font-medium transition-colors"
                        >
                          View Deal Room →
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
