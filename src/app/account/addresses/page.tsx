"use client";

import { useState } from "react";
import { MapPin, Plus, Check, Edit2, Trash2, Home, Briefcase } from "lucide-react";
import toast from "react-hot-toast";
import { Address } from "@/types";

const INITIAL_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    fullName: "Shaswat Jaiswal",
    phone: "+91 98765 43210",
    streetAddress: "42 Luxury Avenue, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400050",
    country: "India",
    isDefault: true,
    type: "Home",
  },
  {
    id: "addr-2",
    fullName: "Shaswat Jaiswal",
    phone: "+91 98765 43210",
    streetAddress: "Tower B, Level 14, Tech Park, Electronic City",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560100",
    country: "India",
    isDefault: false,
    type: "Work",
  },
];

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [showForm, setShowForm] = useState(false);
  const [newAddr, setNewAddr] = useState<{
    fullName: string;
    phone: string;
    streetAddress: string;
    city: string;
    state: string;
    pincode: string;
    type: "Home" | "Work" | "Other";
  }>({
    fullName: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    pincode: "",
    type: "Home",
  });

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    toast.success("Default shipping address updated!");
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success("Address removed!");
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.streetAddress || !newAddr.city || !newAddr.pincode) {
      toast.error("Please fill in all required address fields.");
      return;
    }
    const created = {
      id: `addr-${Date.now()}`,
      ...newAddr,
      country: "India",
      isDefault: addresses.length === 0,
    };
    setAddresses((prev) => [...prev, created]);
    setShowForm(false);
    setNewAddr({ fullName: "", phone: "", streetAddress: "", city: "", state: "", pincode: "", type: "Home" });
    toast.success("New address added successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-black/5 dark:border-white/10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Saved Addresses</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              Manage your delivery locations for fast 1-click checkout.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" /> Add New Address
          </button>
        </div>

        {/* Add Address Form Modal / Inline */}
        {showForm && (
          <form onSubmit={handleAddAddress} className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-amber-500/30 space-y-4">
            <h3 className="font-bold text-zinc-900 dark:text-white text-base">New Delivery Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name *"
                value={newAddr.fullName}
                onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
              />
              <input
                type="text"
                placeholder="Phone Number *"
                value={newAddr.phone}
                onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
              />
              <input
                type="text"
                placeholder="Street Address, Flat/House No. *"
                value={newAddr.streetAddress}
                onChange={(e) => setNewAddr({ ...newAddr, streetAddress: e.target.value })}
                className="sm:col-span-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
              />
              <input
                type="text"
                placeholder="City *"
                value={newAddr.city}
                onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
              />
              <input
                type="text"
                placeholder="State *"
                value={newAddr.state}
                onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
              />
              <input
                type="text"
                placeholder="Pincode *"
                value={newAddr.pincode}
                onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
              />
              <select
                value={newAddr.type}
                onChange={(e) => setNewAddr({ ...newAddr, type: e.target.value as any })}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400"
              >
                Save Address
              </button>
            </div>
          </form>
        )}

        {/* List of Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                addr.isDefault
                  ? "border-amber-500/50 bg-amber-500/5 shadow-md shadow-amber-500/10"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {addr.type === "Home" ? (
                      <Home className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Briefcase className="w-4 h-4 text-amber-500" />
                    )}
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                      {addr.type}
                    </span>
                  </div>
                  {addr.isDefault && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider">
                      Default
                    </span>
                  )}
                </div>

                <div>
                  <div className="font-bold text-zinc-900 dark:text-white text-base">{addr.fullName}</div>
                  <p className="text-zinc-600 dark:text-zinc-400 text-xs mt-1 leading-relaxed">
                    {addr.streetAddress}, {addr.city}, {addr.state} - {addr.pincode}, {addr.country}
                  </p>
                  <p className="text-zinc-500 text-xs mt-2 font-medium">Phone: {addr.phone}</p>
                </div>
              </div>

              <div className="pt-5 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 mt-4">
                {!addr.isDefault ? (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Make Default
                  </button>
                ) : (
                  <span className="text-[11px] text-zinc-400 font-semibold">Primary Address</span>
                )}
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
