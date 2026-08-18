"use client";

import { useState, useEffect } from "react";
import { Product, ProductVariant, ProductWeightOption } from "@/types";
import { formatCurrency, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import { X, Star, ShoppingBag, Check, ShieldCheck, Truck, Plus, Minus, PackageCheck } from "lucide-react";
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
  const [selectedWeight, setSelectedWeight] = useState<ProductWeightOption | undefined>(
    product?.weightOptions?.[0]
  );
  const defaultPlaceholder = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400";
  const [selectedImage, setSelectedImage] = useState<string>(product?.images?.[0] || defaultPlaceholder);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants?.[0]);
      setSelectedWeight(product.weightOptions?.[0]);
      setSelectedImage(product.images?.[0] || defaultPlaceholder);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  // Real-time price calculation based on selected weight option or variant
  const currentPrice = selectedWeight?.price ?? selectedVariant?.price ?? product.price;
  const currentMrp = selectedWeight?.mrp ?? selectedVariant?.mrp ?? product.mrp;
  const discount = calculateDiscount(currentMrp, currentPrice);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 z-10 grid grid-cols-1 md:grid-cols-2 animate-in zoom-in-95 duration-200 my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-rose-500 hover:text-white transition-colors"
          title="Close Popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Preview */}
        <div className="p-6 bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 mb-4 shadow-sm">
            <Image
              src={selectedImage || product.images?.[0] || defaultPlaceholder}
              alt={product.name || "Product"}
              fill
              className="object-contain p-6"
            />
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-amber-500 text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm">
                -{discount}% OFF
              </span>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto max-w-full pb-1">
            {(product.images || []).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                  selectedImage === img ? "border-amber-500 scale-105 shadow-sm" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img} alt="thumb" fill className="object-contain p-1" />
              </button>
            ))}
          </div>
        </div>

        {/* Details & Dynamic Controls */}
        <div className="p-6 flex flex-col justify-between space-y-4 max-h-[85vh] overflow-y-auto">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                {product.category}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                {product.brand}
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
              {product.name}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-2 mt-2.5 text-amber-400 text-xs font-bold">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="text-zinc-900 dark:text-zinc-100 text-xs">{product.rating}</span>
              <span className="text-zinc-400 text-[11px]">({product.reviewCount} Reviews)</span>
            </div>

            {/* WEIGHT / PACK SIZE SELECTION OPTIONS (Dynamic from Admin) */}
            {product.weightOptions && product.weightOptions.length > 0 && (
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <PackageCheck className="w-3.5 h-3.5 text-amber-500" />
                    Select Pack Size / Weight:
                  </label>
                  {selectedWeight && (
                    <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                      {selectedWeight.weight}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.weightOptions.map((opt) => {
                    const isSelected = selectedWeight?.id === opt.id || selectedWeight?.weight === opt.weight;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedWeight(opt)}
                        className={`relative p-2 rounded-xl text-left border-2 transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-200 shadow-sm ring-2 ring-amber-500/20"
                            : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold truncate">
                            {opt.weight}
                          </span>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-amber-500 text-black flex items-center justify-center flex-shrink-0">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="text-xs font-black text-zinc-900 dark:text-white">
                            {formatCurrency(opt.price)}
                          </span>
                          {opt.mrp && opt.mrp > opt.price && (
                            <span className="text-[10px] text-zinc-400 line-through">
                              {formatCurrency(opt.mrp)}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Finish / Color Variants (if applicable) */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                  Select Finish / Variant:
                </label>
                <div className="flex flex-wrap gap-2">
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

            {/* Price Display */}
            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(currentPrice)}
                </span>
                {currentMrp > currentPrice && (
                  <span className="text-sm text-zinc-400 line-through">
                    {formatCurrency(currentMrp)}
                  </span>
                )}
              </div>
              {(selectedWeight?.weight || product.weight) && (
                <span className="text-xs font-extrabold bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/20">
                  Net: {selectedWeight?.weight || product.weight} ({product.stock} {product.unit || "kg"} in stock)
                </span>
              )}
            </div>
          </div>

          {/* Quantity Stepper & Add to Cart */}
          <div className="space-y-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            {/* Quantity Controller */}
            <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 ml-2">
                Quantity:
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:border-amber-500 hover:text-amber-500 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-black text-zinc-900 dark:text-white w-6 text-center tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:border-amber-500 hover:text-amber-500 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                addToCart(product, quantity, selectedVariant, selectedWeight);
                toast.success(`Added ${quantity} × ${product.name} ${selectedWeight ? `(${selectedWeight.weight})` : ""} to Cart!`);
                onClose();
              }}
              className="w-full py-3.5 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Cart Now • {formatCurrency(currentPrice * quantity)}
            </button>

            <div className="flex justify-around text-[10px] text-zinc-500 font-medium pt-1">
              <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-emerald-500" /> Free Express Delivery</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Quality Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
