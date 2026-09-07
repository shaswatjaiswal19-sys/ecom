"use client";

import { useState } from "react";
import { Users, Search, Shield, Award, Wallet, Star, Mail, Phone } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

const MOCK_CUSTOMERS = [
  {
    id: "usr-1",
    fullName: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 98200 11223",
    role: "customer",
    walletBalance: 2500,
    rewardPoints: 4200,
    totalOrders: 6,
    spentTotal: 189999,
    joinedDate: "2026-01-15",
  },
  {
    id: "usr-2",
    fullName: "Arjun Mehra",
    email: "arjun.m@example.com",
    phone: "+91 98111 44556",
    role: "customer",
    walletBalance: 1200,
    rewardPoints: 8900,
    totalOrders: 12,
    spentTotal: 450000,
    joinedDate: "2025-11-20",
  },
  {
    id: "usr-3",
    fullName: "Manoj Admin",
    email: "admin@manojtraders.com",
    phone: "+91 99999 88888",
    role: "admin",
    walletBalance: 50000,
    rewardPoints: 99999,
    totalOrders: 0,
    spentTotal: 0,
    joinedDate: "2025-01-01",
  },
];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleRole = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, role: c.role === "admin" ? "customer" : "admin" } : c
      )
    );
    toast.success("User access role updated!");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">Customers & Staff CRM</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Manage customer accounts, wallet balances, reward points, and admin roles.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm max-w-md">
        <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search by customer name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-sm text-zinc-900 dark:text-white w-full placeholder:text-zinc-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Wallet Balance</th>
                <th className="py-4 px-6">Reward Points</th>
                <th className="py-4 px-6">Total Spent</th>
                <th className="py-4 px-6 text-right">Role Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 font-black flex items-center justify-center">
                        {c.fullName[0]}
                      </div>
                      <div>
                        <div className="font-bold text-zinc-900 dark:text-white">{c.fullName}</div>
                        <div className="text-xs text-zinc-400">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                        c.role === "admin"
                          ? "bg-amber-500 text-black"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {c.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-zinc-900 dark:text-white">
                    {formatCurrency(c.walletBalance)}
                  </td>
                  <td className="py-4 px-6 font-bold text-amber-500">
                    {c.rewardPoints.toLocaleString()} PTS
                  </td>
                  <td className="py-4 px-6 font-black text-zinc-900 dark:text-white">
                    {formatCurrency(c.spentTotal)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleToggleRole(c.id)}
                      className="text-xs font-bold text-amber-500 hover:underline"
                    >
                      Switch to {c.role === "admin" ? "Customer" : "Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
