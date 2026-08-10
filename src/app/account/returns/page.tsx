"use client";

import { useState } from "react";
import { RotateCcw, Package, Clock, CheckCircle2, AlertCircle, Plus, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

const MOCK_RETURNS = [
  {
    id: "ret-101",
    orderNumber: "MT-2026-8812",
    item: "Lumina Signature Hi-Fi Speakers",
    reason: "Damaged packaging during transit",
    status: "Processed",
    refundAmount: 249999,
    createdAt: "2026-07-28",
  },
  {
    id: "ret-102",
    orderNumber: "MT-2026-9041",
    item: "Chronos Titanium Smart Watch",
    reason: "Size mismatch",
    status: "Pending",
    refundAmount: 89999,
    createdAt: "2026-08-02",
  },
];

export default function AccountReturnsPage() {
  const [returnsList, setReturnsList] = useState(MOCK_RETURNS);
  const [showModal, setShowModal] = useState(false);
  const [orderNum, setOrderNum] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNum || !reason) {
      toast.error("Please enter Order Number and Reason for return.");
      return;
    }
    const newReturn = {
      id: `ret-${Date.now().toString().slice(-3)}`,
      orderNumber: orderNum,
      item: "Luxury Purchase Item",
      reason: reason,
      status: "Pending" as const,
      refundAmount: 49999,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setReturnsList([newReturn, ...returnsList]);
    setShowModal(false);
    setOrderNum("");
    setReason("");
    toast.success("Return request submitted! Our courier partner will contact you for pickup.");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-black/5 dark:border-white/10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Returns & Refunds</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              7-day hassle-free doorstep pickup & instant refund guarantee.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" /> Request Return
          </button>
        </div>

        {/* Modal / Request Form */}
        {showModal && (
          <form onSubmit={handleSubmitReturn} className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-amber-500/30 space-y-4">
            <h3 className="font-bold text-zinc-900 dark:text-white text-base">Submit Return Request</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Order Number (e.g. MT-2026-8812)"
                value={orderNum}
                onChange={(e) => setOrderNum(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
              />
              <textarea
                placeholder="Reason for Return / Defect details..."
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
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
                className="px-5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400"
              >
                Submit Request
              </button>
            </div>
          </form>
        )}

        {/* Returns Table / List */}
        <div className="space-y-4">
          {returnsList.map((ret) => (
            <div
              key={ret.id}
              className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-500">{ret.orderNumber}</span>
                    <span className="text-zinc-400 text-xs">• Requested on {ret.createdAt}</span>
                  </div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white mt-0.5">{ret.item}</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Reason: {ret.reason}</p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-200 dark:border-zinc-800">
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                    ret.status === "Processed"
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                  }`}
                >
                  {ret.status === "Processed" ? "Refund Processed" : "Under Review"}
                </span>
                <span className="text-sm font-black text-zinc-900 dark:text-white mt-1">
                  {formatCurrency(ret.refundAmount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
