"use client";

import { useState } from "react";
import { useProductStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Sparkles, Check, X, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import toast from "react-hot-toast";

export default function ComparePage() {
  const { products } = useProductStore();
  const p1 = products[0] || products[0];
  const p2 = products[1] || products[0];
  const p3 = products[2] || products[0];

  const { addToCart } = useCartStore();

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const compareList = [p1, p2, p3];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Spec-by-Spec Matrix
        </div>
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white">Product Comparison</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Compare specifications, materials, pricing, and features side-by-side.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm overflow-x-auto p-6">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <th className="p-4 text-xs font-bold uppercase text-zinc-400 w-1/4">Specification</th>
              {compareList.map((p) => (
                <th key={p.id} className="p-4 w-1/4 text-center">
                  <img src={p.images[0]} alt={p.name} className="w-20 h-20 rounded-2xl object-cover mx-auto mb-2 border border-zinc-200 dark:border-zinc-800" />
                  <div className="font-bold text-sm text-zinc-900 dark:text-white line-clamp-1">{p.name}</div>
                  <div className="text-amber-500 font-black text-sm mt-1">{formatCurrency(p.price)}</div>
                  <button
                    onClick={() => handleAddToCart(p)}
                    className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 w-full flex items-center justify-center gap-1"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs text-zinc-700 dark:text-zinc-300">
            <tr>
              <td className="p-4 font-bold text-zinc-400">Category</td>
              {compareList.map((p) => (
                <td key={p.id} className="p-4 text-center capitalize font-semibold">{p.category}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-zinc-400">SKU Code</td>
              {compareList.map((p) => (
                <td key={p.id} className="p-4 text-center font-mono font-bold text-amber-500">{p.sku}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-zinc-400">Weight & Dimensions</td>
              {compareList.map((p) => (
                <td key={p.id} className="p-4 text-center">{p.weight} ({p.dimensions})</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-zinc-400">GST Rate</td>
              {compareList.map((p) => (
                <td key={p.id} className="p-4 text-center">{p.gstPercentage}% GST Included</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-zinc-400">Key Material</td>
              {compareList.map((p) => (
                <td key={p.id} className="p-4 text-center font-medium">
                  {p.specifications.find((s) => s.key === "Material")?.value || "Aerospace Alloy"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-zinc-400">In Stock</td>
              {compareList.map((p) => (
                <td key={p.id} className="p-4 text-center font-bold text-emerald-500">
                  <Check className="w-4 h-4 mx-auto text-emerald-500" /> Yes ({p.stock} {p.unit || "kg"})
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
