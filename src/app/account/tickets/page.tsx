"use client";

import { useState } from "react";
import { HeadphonesIcon, MessageSquare, Plus, Clock, CheckCircle, AlertCircle, Send } from "lucide-react";
import toast from "react-hot-toast";

const MOCK_TICKETS = [
  {
    id: "tck-801",
    ticketNumber: "TCK-9901",
    subject: "Inquiry regarding express delivery timeline to Pune",
    category: "Order",
    status: "Resolved",
    priority: "Medium",
    createdAt: "2026-08-01",
    lastMessage: "Thank you for confirming delivery window. Package arrived safely.",
  },
  {
    id: "tck-802",
    ticketNumber: "TCK-9945",
    subject: "Requesting GST B2B Tax Invoice copy with company GSTIN",
    category: "Payment",
    status: "In Progress",
    priority: "High",
    createdAt: "2026-08-05",
    lastMessage: "Our billing department is updating your invoice document now.",
  },
];

export default function AccountTicketsPage() {
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Order");
  const [message, setMessage] = useState("");

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      toast.error("Please fill in Subject and Message.");
      return;
    }
    const newTicket = {
      id: `tck-${Date.now().toString().slice(-3)}`,
      ticketNumber: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject,
      category,
      status: "In Progress" as const,
      priority: "High" as const,
      createdAt: new Date().toISOString().split("T")[0],
      lastMessage: message,
    };
    setTickets([newTicket, ...tickets]);
    setShowModal(false);
    setSubject("");
    setMessage("");
    toast.success("Support ticket created! A luxury concierge representative will reply shortly.");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-black/5 dark:border-white/10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Customer Support Tickets</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              Direct priority channel to Manoj Traders concierge support team.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" /> Create New Ticket
          </button>
        </div>

        {/* Modal / Form */}
        {showModal && (
          <form onSubmit={handleCreateTicket} className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-amber-500/30 space-y-4">
            <h3 className="font-bold text-zinc-900 dark:text-white text-base">New Support Ticket</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Subject *"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
              >
                <option value="Order">Order Issue</option>
                <option value="Payment">Payment & Billing</option>
                <option value="Product">Product Technical Inquiry</option>
                <option value="Other">Other Query</option>
              </select>
              <textarea
                placeholder="Describe your issue or question in detail..."
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Submit Ticket
              </button>
            </div>
          </form>
        )}

        {/* Tickets List */}
        <div className="space-y-4">
          {tickets.map((tck) => (
            <div
              key={tck.id}
              className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-500">{tck.ticketNumber}</span>
                  <span className="text-zinc-400 text-xs">• Category: {tck.category}</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase w-fit ${
                    tck.status === "Resolved"
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                  }`}
                >
                  {tck.status}
                </span>
              </div>

              <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{tck.subject}</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                "{tck.lastMessage}"
              </p>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                <span>Opened on {tck.createdAt}</span>
                <span className="text-amber-500 font-semibold cursor-pointer hover:underline">View Ticket Conversation</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
