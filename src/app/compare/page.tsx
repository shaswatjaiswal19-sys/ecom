"use client";

import { useProductStore, useCompareStore, useCartStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Sparkles, Check, ShoppingBag, ArrowRight, Scale, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ComparePage() {
  const { products } = useProductStore();
  const { compareItems, removeFromCompare, clearCompare } = useCompareStore();
  const { addToCart } = useCartStore();

  const rawList = compareItems.length > 0 ? compareItems : products.slice(0, 3);
  const compareList = (rawList || []).filter(Boolean);

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  if (compareList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-3xl mx-auto flex items-center justify-center border border-amber-500/20">
          <Scale className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">No Products to Compare</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-md mx-auto">
            Add products to your comparison list while browsing our grocery catalog to see specs, pricing, and ingredients side-by-side.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm transition-all shadow-lg shadow-amber-500/20"
        >
          <span>Explore Grocery Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Spec-by-Spec Matrix
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">Product Comparison</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Comparing {compareList.length} items side-by-side.
          </p>
        </div>
        {compareItems.length > 0 && (
          <button
            onClick={() => {
              clearCompare();
              toast.success("Comparison list cleared");
            }}
            className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-all w-fit"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Comparison
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm overflow-x-auto p-6">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <th className="p-4 text-xs font-bold uppercase text-zinc-400 w-1/4">Specification</th>
              {compareList.map((p) => {
                const imgUrl = p.images?.[0] || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400";
                return (
                  <th key={p.id} className="p-4 w-1/4 text-center align-top relative group">
                    {compareItems.some((item) => item.id === p.id) && (
                      <button
                        onClick={() => removeFromCompare(p.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-red-500 transition-colors"
                        title="Remove from comparison"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <img
                      src={imgUrl}
                      alt={p.name || "Product"}
                      className="w-20 h-20 rounded-2xl object-cover mx-auto mb-2 border border-zinc-200 dark:border-zinc-800"
                    />
                    <div className="font-bold text-sm text-zinc-900 dark:text-white line-clamp-1">{p.name}</div>
                    <div className="text-amber-500 font-black text-sm mt-1">{formatCurrency(p.price || 0)}</div>
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 w-full flex items-center justify-center gap-1 shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs text-zinc-700 dark:text-zinc-300">
            <tr>
              <td className="p-4 font-bold text-zinc-400">Category</td>
              {compareList.map((p) => (
                <td key={p.id} className="p-4 text-center capitalize font-semibold">{p.category || "General"}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-zinc-400">SKU Code</td>
              {compareList.map((p) => (
                <td key={p.id} className="p-4 text-center font-mono font-bold text-amber-500">{p.sku || "MT-N/A"}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-zinc-400">Weight & Dimensions</td>
              {compareList.map((p) => (
                <td key={p.id} className="p-4 text-center">
                  {p.weight || "N/A"} {p.dimensions ? `(${p.dimensions})` : ""}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-zinc-400">GST Rate</td>
              {compareList.map((p) => (
                <td key={p.id} className="p-4 text-center">{p.gstPercentage ?? 5}% GST Included</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-zinc-400">In Stock</td>
              {compareList.map((p) => (
                <td key={p.id} className="p-4 text-center font-bold text-emerald-500">
                  <Check className="w-4 h-4 mx-auto text-emerald-500" /> Yes ({p.stock ?? 0} {p.unit || "unit"})
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
