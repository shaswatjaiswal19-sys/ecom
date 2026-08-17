"use client";

import { useState, useEffect } from "react";
import { Product, ProductVariant } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import { X, Star, ShoppingBag, Check, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart } = useCartStore();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants?.[0]
  );
  const defaultPlaceholder = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400";
  const [selectedImage, setSelectedImage] = useState<string>(product?.images?.[0] || defaultPlaceholder);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants?.[0]);
      setSelectedImage(product.images?.[0] || defaultPlaceholder);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const currentPrice = selectedVariant?.price || product.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 z-10 grid grid-cols-1 md:grid-cols-2 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-rose-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Preview */}
        <div className="p-6 bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 mb-4">
            <Image
              src={selectedImage || product.images?.[0] || defaultPlaceholder}
              alt={product.name || "Product"}
              fill
              className="object-contain p-6"
            />
          </div>
          <div className="flex gap-2">
            {(product.images || []).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === img ? "border-amber-500 scale-105" : "border-transparent opacity-60"
                }`}
              >
                <Image src={img} alt="thumb" fill className="object-contain p-1" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="p-6 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
              {product.category}
            </span>
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
              {product.name}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center gap-2 mt-3 text-amber-400 text-xs font-bold">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-zinc-900 dark:text-zinc-100">{product.rating}</span>
              <span className="text-zinc-400">({product.reviewCount} Reviews)</span>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-4">
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                  Select Finish / Color:
                </label>
                <div className="flex gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        selectedVariant?.id === v.id
                          ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(currentPrice)}
                </span>
                {product.mrp > currentPrice && (
                  <span className="text-sm text-zinc-400 line-through">
                    {formatCurrency(product.mrp)}
                  </span>
                )}
              </div>
              {product.weight && (
                <span className="text-xs font-extrabold bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/20">
                  Net: {product.weight} ({product.stock} {product.unit || "kg"} in stock)
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => {
                addToCart(product, quantity, selectedVariant);
                toast.success("Added to Cart!");
                onClose();
              }}
              className="w-full py-3.5 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Cart Now
            </button>

            <div className="flex justify-around text-[10px] text-zinc-500 font-medium pt-1">
              <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-emerald-500" /> Free Express Delivery</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 2-Year Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
