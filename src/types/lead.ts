/** A lead / investor record from the `empathy_leads` Firestore collection. */
export interface Lead {
  id: string;
  name: string;
  company: string;
  score: number;
  status: string;
}

/** Subset used by the portal deal-room (no `id` needed for display). */
export type LeadData = Omit<Lead, "id">;

/** An escrow request written to the `escrow_requests` collection. */
export interface EscrowRequest {
  leadId: string;
  leadName: string;
  leadCompany: string;
  requestedAt: Date;
  status: "pending" | "contacted" | "completed";
}
