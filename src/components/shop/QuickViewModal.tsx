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

  const currentAvailableStock = selectedWeight
    ? Number(selectedWeight.stock ?? 0)
    : Number(product.stock ?? 0);
  const isWeightInStock = currentAvailableStock > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-lg animate-in fade-in duration-200" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-900/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.4)] border border-black/10 dark:border-white/10 z-10 grid grid-cols-1 md:grid-cols-2 animate-in zoom-in-95 duration-200 my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-zinc-100/80 dark:bg-zinc-800/80 backdrop-blur-md text-zinc-600 dark:text-zinc-300 hover:bg-rose-500 hover:text-white transition-all shadow-md active:scale-95 border border-black/5 dark:border-white/5"
          title="Close Popup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Gallery Preview */}
        <div className="p-6 bg-radial from-amber-500/10 via-zinc-50 to-zinc-100 dark:from-amber-500/5 dark:via-zinc-950 dark:to-zinc-900 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-black/5 dark:border-white/5">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white/80 dark:bg-zinc-900/80 border border-black/5 dark:border-white/10 mb-4 shadow-inner">
            <Image
              src={selectedImage || product.images?.[0] || defaultPlaceholder}
              alt={product.name || "Product"}
              fill
              className="object-contain p-6 hover:scale-105 transition-transform duration-500"
            />
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md shadow-amber-500/20 tracking-wider">
                -{discount}% OFF
              </span>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto max-w-full pb-1 scrollbar-none">
            {(product.images || []).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white dark:bg-zinc-800 ${
                  selectedImage === img ? "border-amber-500 scale-105 shadow-md shadow-amber-500/20" : "border-transparent opacity-60 hover:opacity-100"
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
              <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                {product.category}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                {product.brand}
              </span>
            </div>

            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 mt-2">
              {product.name}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-2 mt-2.5 text-amber-400 text-xs font-black">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="text-zinc-900 dark:text-zinc-100 text-xs">{product.rating}</span>
              <span className="text-zinc-400 text-[11px] font-medium">({product.reviewCount} Reviews)</span>
            </div>

            {/* WEIGHT / PACK SIZE SELECTION OPTIONS */}
            {product.weightOptions && product.weightOptions.length > 0 && (
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-extrabold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <PackageCheck className="w-3.5 h-3.5 text-amber-500" />
                    Select Pack Size / Weight:
                  </label>
                  {selectedWeight && (
                    <span className={`text-[11px] font-bold ${isWeightInStock ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                      {selectedWeight.weight} ({isWeightInStock ? `${currentAvailableStock} available` : "Out of stock"})
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.weightOptions.map((opt) => {
                    const isSelected = selectedWeight?.id === opt.id || selectedWeight?.weight === opt.weight;
                    const optStock = Number(opt.stock ?? 0);
                    const optInStock = optStock > 0;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSelectedWeight(opt);
                          setQuantity(1);
                        }}
                        className={`relative p-2.5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-amber-500 bg-gradient-to-br from-amber-500/15 to-amber-500/5 text-amber-900 dark:text-amber-200 shadow-md ring-2 ring-amber-500/20 scale-[1.02]"
                            : optInStock
                            ? "border-zinc-200/80 dark:border-zinc-800 hover:border-amber-500/40 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300"
                            : "border-rose-500/30 bg-rose-500/5 text-zinc-400 dark:text-zinc-500 opacity-75"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-black truncate">
                            {opt.weight}
                          </span>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-amber-500 text-black flex items-center justify-center flex-shrink-0 shadow-xs">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <div className="mt-1.5 flex items-baseline justify-between gap-1">
                          <div className="flex items-baseline gap-1">
                            <span className="text-xs font-black text-zinc-900 dark:text-white">
                              {formatCurrency(opt.price)}
                            </span>
                            {opt.mrp && opt.mrp > opt.price && (
                              <span className="text-[9px] text-zinc-400 line-through">
                                {formatCurrency(opt.mrp)}
                              </span>
                            )}
                          </div>
                          <span className={`text-[9px] font-extrabold ${optInStock ? (optStock <= 10 ? "text-amber-500" : "text-emerald-600 dark:text-emerald-400") : "text-rose-500"}`}>
                            {optInStock ? `${optStock} left` : "0 stock"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Finish / Color Variants */}
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
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        selectedVariant?.id === v.id
                          ? "border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-400 shadow-sm"
                          : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400"
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price & Stock Display */}
            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(currentPrice)}
                </span>
                {currentMrp > currentPrice && (
                  <span className="text-xs text-zinc-400 line-through font-medium">
                    {formatCurrency(currentMrp)}
                  </span>
                )}
              </div>
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full border shadow-xs ${
                isWeightInStock
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25"
              }`}>
                {isWeightInStock
                  ? `${selectedWeight?.weight || product.weight} • ${currentAvailableStock} in stock`
                  : `${selectedWeight?.weight || product.weight} • Out of Stock`}
              </span>
            </div>
          </div>

          {/* Quantity Stepper & Add to Cart */}
          <div className="space-y-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            {/* Quantity Controller */}
            <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/60 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-extrabold text-zinc-700 dark:text-zinc-300 ml-2">
                Quantity:
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={quantity <= 1 || !isWeightInStock}
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:border-amber-500 hover:text-amber-500 transition-colors disabled:opacity-40 shadow-xs"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-black text-zinc-900 dark:text-white w-6 text-center tabular-nums">
                  {isWeightInStock ? quantity : 0}
                </span>
                <button
                  type="button"
                  disabled={quantity >= currentAvailableStock || !isWeightInStock}
                  onClick={() => setQuantity((prev) => Math.min(currentAvailableStock, prev + 1))}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:border-amber-500 hover:text-amber-500 transition-colors disabled:opacity-40 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              disabled={!isWeightInStock || currentAvailableStock <= 0}
              onClick={() => {
                addToCart(product, quantity, selectedVariant, selectedWeight);
                toast.success(`Added ${quantity} × ${product.name} ${selectedWeight ? `(${selectedWeight.weight})` : ""} to Cart! 🎉`);
                onClose();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-xs uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              <ShoppingBag className="w-4 h-4" />
              {isWeightInStock
                ? `Add to Cart Now • ${formatCurrency(currentPrice * quantity)}`
                : `Out of Stock for ${selectedWeight?.weight || "this weight"}`}
            </button>

            <div className="flex justify-around text-[10px] text-zinc-500 font-semibold pt-1">
              <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-emerald-500" /> Free Express Delivery</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Quality Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
