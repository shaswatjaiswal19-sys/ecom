"use client";

import { use, useState, useEffect, Suspense } from "react";
import { notFound, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useProductStore } from "@/lib/store";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { getProductBySlug, getProductsFromStore } from "@/lib/firestore";
import { formatCurrency } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Product, ProductVariant, ProductWeightOption } from "@/types";
import {
  Star, ShoppingBag, Heart, Share2, Shield, Truck, RefreshCw,
  ChevronRight, Package, Zap, BarChart3, Info, CheckCircle2, ZoomIn, Loader2, PackageCheck
} from "lucide-react";
import toast from "react-hot-toast";

const Product360Viewer = dynamic(() => import("@/components/3d/Product360Viewer"), { ssr: false });

interface PageProps {
  params: Promise<{ slug: string }>;
}

function ProductDetailContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const initialViewMode = searchParams.get("view") === "360" ? "360" : "overview";

  const { products, setProducts } = useProductStore();
  const { dict, getLocalizedProduct, formatWeight, formatCategory, language } = useLanguage();
  const [liveProduct, setLiveProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const product =
    liveProduct ||
    products.find((p) => p.slug === slug || p.id === slug);

  const localized = getLocalizedProduct(product);

  useEffect(() => {
    let isMounted = true;
    getProductBySlug(slug)
      .then((p) => {
        if (isMounted) {
          if (p) setLiveProduct(p);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(product?.variants?.[0]);
  const [selectedWeight, setSelectedWeight] = useState<ProductWeightOption | undefined>(product?.weightOptions?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "reviews" | "360">(initialViewMode);

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants?.[0]);
      setSelectedWeight(product.weightOptions?.[0]);
    }
  }, [product]);

  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  if (!product && isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 space-y-4">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        <p className="text-zinc-500 text-sm font-semibold">Loading fresh farm product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 space-y-4">
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Product Not Found</h2>
        <p className="text-zinc-500 text-sm">The grocery product you are looking for does not exist or has been removed.</p>
        <Link href="/shop" className="px-6 py-2.5 rounded-2xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-colors">
          Browse Catalog
        </Link>
      </div>
    );
  }

  const currentPrice = selectedWeight?.price ?? selectedVariant?.price ?? product.price;
  const currentMrp = selectedWeight?.mrp ?? selectedVariant?.mrp ?? product.mrp;
  const isWishlisted = isInWishlist(product.id);
  const discount = Math.round(((currentMrp - currentPrice) / currentMrp) * 100);

  const currentWeightStock = selectedWeight
    ? Number(selectedWeight.stock ?? 0)
    : Number(product.stock ?? 0);
  const isWeightInStock = currentWeightStock > 0;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 py-6 sm:py-12 pb-28 lg:pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 sm:gap-2 text-xs text-zinc-500 mb-4 sm:mb-8 overflow-x-auto pb-1 scrollbar-none">
          <Link href="/" className="hover:text-amber-500 transition-colors whitespace-nowrap">{dict.nav.home}</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <Link href="/shop" className="hover:text-amber-500 transition-colors whitespace-nowrap">{dict.shop.title}</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-amber-500 transition-colors whitespace-nowrap">
            {localized.category}
          </Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <span className="text-zinc-900 dark:text-white font-semibold truncate max-w-[150px] sm:max-w-[200px]">{localized.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 xl:gap-16">
          {/* ===== LEFT: Gallery Panel ===== */}
          <div className="space-y-3 sm:space-y-4">
            {/* View Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {["overview", "360", "specs", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className={`px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {tab === "360"
                    ? "🔄 " + dict.product.view360
                    : tab === "overview"
                    ? (language === "hi" ? "विवरण" : "Overview")
                    : tab === "specs"
                    ? (language === "hi" ? "विनिर्देश" : "Specifications")
                    : (language === "hi" ? "समीक्षाएं" : "Reviews")}
                </button>
              ))}
            </div>

            {activeTab === "360" ? (
              <Product360Viewer images={product.images360 || product.images} productName={localized.name} />
            ) : (
              <>
                {/* Main Image */}
                <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/10 group">
                  <Image
                    src={product.images[selectedImage]}
                    alt={localized.name}
                    fill
                    className="object-contain p-4 sm:p-8 group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  {discount > 0 && (
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-amber-500 text-black text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow">
                      -{discount}% {dict.common.off}
                    </div>
                  )}
                  <button className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 p-2 sm:p-2.5 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-700 transition-colors shadow">
                    <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-700 dark:text-zinc-300" />
                  </button>
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none">
                  {(product.images || []).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative w-14 h-14 sm:w-18 sm:h-18 flex-shrink-0 rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all ${
                        selectedImage === i
                          ? "border-amber-500 shadow-md scale-105"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt={`View ${i + 1}`} fill className="object-contain p-1.5 sm:p-2" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ===== RIGHT: Product Info Panel ===== */}
          <div className="space-y-4 sm:space-y-6">
            {/* Brand & Category */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-amber-500 uppercase tracking-widest">{product.brand}</span>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <span className="text-zinc-500">{localized.category}</span>
              {product.has360View && (
                <span className="ml-1 text-[10px] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-2 py-0.5 rounded-full font-bold">
                  {dict.product.view360}
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white leading-tight">{localized.name}</h1>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 italic">{localized.tagline}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < Math.floor(product.rating) ? "fill-amber-400" : "fill-zinc-200 dark:fill-zinc-700"}`} />
                ))}
              </div>
              <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">{product.rating}</span>
              <span className="text-[11px] sm:text-xs text-zinc-400">({product.reviewCount} {dict.product.reviews})</span>
            </div>

            {/* Pricing Block */}
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/10">
              <div className="flex items-baseline gap-2.5 sm:gap-4 flex-wrap">
                <span className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white">
                  {formatCurrency(currentPrice)}
                </span>
                {product.mrp > currentPrice && (
                  <>
                    <span className="text-sm sm:text-lg text-zinc-400 line-through">{formatCurrency(product.mrp)}</span>
                    <span className="text-[10px] sm:text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                      {dict.product.saveAmount} {formatCurrency(product.mrp - currentPrice)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-1">
                {dict.common.gstIncluded} • {dict.product.deliveryEstimate}
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${selectedWeight ? (Number(selectedWeight.stock ?? 0) > 0 ? "bg-emerald-500" : "bg-rose-500") : (product.inStock ? "bg-emerald-500" : "bg-rose-500")} animate-pulse`} />
                  <span className={`text-[11px] sm:text-xs font-bold ${selectedWeight ? (Number(selectedWeight.stock ?? 0) > 0 ? "text-emerald-500" : "text-rose-500") : (product.inStock ? "text-emerald-500" : "text-rose-500")}`}>
                    {selectedWeight
                      ? (Number(selectedWeight.stock ?? 0) > 0
                          ? `${dict.common.inStock} (${Number(selectedWeight.stock)} left for ${formatWeight(selectedWeight.weight)})`
                          : `${dict.common.outOfStock} for ${formatWeight(selectedWeight.weight)}`)
                      : (product.inStock ? `${dict.common.inStock} (${product.stock} available)` : dict.common.outOfStock)}
                  </span>
                </div>
                {product.weight && (
                  <span className="text-[10px] sm:text-xs font-extrabold bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2 sm:px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    Net: {formatWeight(product.weight)}
                  </span>
                )}
              </div>
            </div>

            {/* Weight / Pack Size Options */}
            {product.weightOptions && product.weightOptions.length > 0 && (
              <div className="space-y-2.5 sm:space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <PackageCheck className="w-4 h-4 text-amber-500" />
                    {dict.product.selectWeight}:
                  </label>
                  {selectedWeight && (
                    <span className={`text-[11px] sm:text-xs font-black ${Number(selectedWeight.stock ?? 0) > 0 ? "text-amber-600 dark:text-amber-400" : "text-rose-500"}`}>
                      {formatWeight(selectedWeight.weight)} ({Number(selectedWeight.stock ?? 0) > 0 ? `${selectedWeight.stock} left` : "0 stock"})
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
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
                        className={`relative p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-amber-500 bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent text-amber-950 dark:text-amber-200 shadow-md ring-2 ring-amber-500/20"
                            : optInStock
                            ? "border-zinc-200/80 dark:border-zinc-800 hover:border-amber-500/40 bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300"
                            : "border-rose-500/30 bg-rose-500/5 text-zinc-400 dark:text-zinc-500 opacity-75"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-black truncate">{formatWeight(opt.weight)}</span>
                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 flex-shrink-0" />
                          )}
                        </div>
                        <div className="mt-1.5 sm:mt-2 flex items-baseline justify-between gap-1">
                          <div className="flex items-baseline gap-1">
                            <span className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white">
                              {formatCurrency(opt.price)}
                            </span>
                            {opt.mrp && opt.mrp > opt.price && (
                              <span className="text-[9px] sm:text-[10px] text-zinc-400 line-through">
                                {formatCurrency(opt.mrp)}
                              </span>
                            )}
                          </div>
                          <span className={`text-[9px] sm:text-[10px] font-extrabold ${optInStock ? (optStock <= 10 ? "text-amber-500" : "text-emerald-600 dark:text-emerald-400") : "text-rose-500"}`}>
                            {optInStock ? `${optStock} left` : "0 stock"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="pt-1">
                <label className="block text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider mb-2 sm:mb-3">
                  {dict.product.weightVariant}:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`relative px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-black border-2 transition-all ${
                        selectedVariant?.id === v.id
                          ? "border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-400 shadow-md"
                          : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600"
                      }`}
                    >
                      {v.color && (
                        <span
                          className="inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mr-1.5 border border-black/10"
                          style={{ backgroundColor: v.color }}
                        />
                      )}
                      {v.name}
                      {selectedVariant?.id === v.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 absolute -top-1 -right-1 text-amber-500 fill-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 pt-1">
              <label className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">{dict.product.quantity}:</label>
              <div className="flex items-center gap-2 sm:gap-3 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 bg-zinc-50/50 dark:bg-zinc-900/50 shadow-xs">
                <button
                  disabled={quantity <= 1 || !isWeightInStock}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors font-bold text-lg w-5 disabled:opacity-40"
                >
                  −
                </button>
                <span className="font-black text-zinc-900 dark:text-white w-7 sm:w-8 text-center tabular-nums text-sm">
                  {isWeightInStock ? quantity : 0}
                </span>
                <button
                  disabled={quantity >= currentWeightStock || !isWeightInStock}
                  onClick={() => setQuantity(Math.min(currentWeightStock, quantity + 1))}
                  className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors font-bold text-lg w-5 disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex gap-3 pt-2">
              <button
                onClick={() => {
                  addToCart(product, quantity, selectedVariant, selectedWeight);
                  toast.success(`${dict.product.addedToCart} (${quantity} × ${localized.name} ${selectedWeight ? `[${formatWeight(selectedWeight.weight)}]` : ""})`);
                }}
                disabled={!isWeightInStock || currentWeightStock <= 0}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-sm uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5" />
                {isWeightInStock ? dict.product.addToCart : dict.common.outOfStock}
              </button>
              <button
                onClick={() => {
                  toggleWishlist(product);
                  toast.success(isWishlisted ? (language === "hi" ? "हटाया गया" : "Removed from Wishlist") : (language === "hi" ? "पसंदीदा सूची में जोड़ा गया ❤️" : "Saved to Wishlist ❤️"));
                }}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  isWishlisted
                    ? "border-rose-500 bg-rose-500/10 text-rose-500"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-rose-500 hover:text-rose-500"
                }`}
                title={dict.nav.wishlist}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-rose-500" : ""}`} />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success(language === "hi" ? "उत्पाद लिंक कॉपी किया गया!" : "Product link copied!");
                }}
                className="p-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-amber-500 hover:text-amber-500 transition-all"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-zinc-200 dark:border-zinc-800">
              {[
                { icon: Shield, label: dict.home.freshGuaranteed, sub: dict.home.statOrganicLabel },
                { icon: Truck, label: dict.home.expressDelivery, sub: dict.home.statExpressLabel },
                { icon: RefreshCw, label: dict.home.easyReturns, sub: dict.nav.returns },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/10">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mx-auto mb-1" />
                  <div className="text-[10px] sm:text-[11px] font-bold text-zinc-900 dark:text-white line-clamp-1">{label}</div>
                  <div className="text-[9px] sm:text-[10px] text-zinc-500 line-clamp-1">{sub}</div>
                </div>
              ))}
            </div>

            {/* SKU & Stock info */}
            <div className="text-[11px] sm:text-xs text-zinc-400 space-y-0.5 pt-1">
              <p>{dict.product.sku}: <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">{selectedVariant?.sku || product.sku}</span></p>
              <p>{dict.product.weightVariant}: {formatWeight(selectedWeight?.weight || product.weight)}</p>
            </div>
          </div>
        </div>

        {/* ===== PRODUCT TABS ===== */}
        <div className="mt-10 sm:mt-16">
          <div className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800 mb-6 sm:mb-8 overflow-x-auto scrollbar-none">
            {["overview", "specs", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap capitalize ${
                  activeTab === tab
                    ? "border-amber-500 text-amber-600 dark:text-amber-400"
                    : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {tab === "overview" && <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1" />}
                {tab === "specs" && <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1" />}
                {tab === "reviews" && <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1" />}
                {tab === "overview"
                  ? (language === "hi" ? "उत्पाद विवरण" : "Overview")
                  : tab === "specs"
                  ? (language === "hi" ? "विनिर्देश" : "Specifications")
                  : (language === "hi" ? "ग्राहक समीक्षाएं" : "Customer Reviews")}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>{localized.description}</p>
              {localized.features && localized.features.length > 0 && (
                <div className="pt-3">
                  <h3 className="font-bold text-zinc-900 dark:text-white mb-2">{dict.product.highlights}</h3>
                  <ul className="space-y-1.5">
                    {localized.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === "specs" && (
            <div className="max-w-2xl">
              <h3 className="text-sm sm:text-lg font-black text-zinc-900 dark:text-white mb-4">{dict.product.specifications}</h3>
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
                {[
                  { label: dict.product.category, value: localized.category },
                  { label: dict.product.brand, value: product.brand },
                  { label: dict.product.sku, value: selectedVariant?.sku || product.sku },
                  { label: dict.product.weightVariant, value: formatWeight(selectedWeight?.weight || product.weight) || "N/A" },
                  { label: dict.common.inStock, value: `${currentWeightStock} units` },
                  { label: dict.home.freshGuaranteed, value: "100% Pesticide Free Certified" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between px-4 py-2.5 text-xs sm:text-sm border-b border-zinc-100 dark:border-zinc-800 last:border-b-0">
                    <span className="text-zinc-500 font-medium">{label}</span>
                    <span className="font-bold text-zinc-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="max-w-2xl space-y-3">
              {[
                { name: "Rajesh Sharma", rating: 5, comment: language === "hi" ? "उत्कृष्ट गुणवत्ता वाला A2 घी और चावल। बहुत स्वादिष्ट और शुद्ध।" : "Top quality A2 ghee and basmati. Aroma is authentic and delicious.", date: "2 days ago" },
                { name: "Priya Mehta", rating: 5, comment: language === "hi" ? "24 घंटे में सुरक्षित सीलबंद पैकिंग में मिला। बहुत प्रभावित हुई!" : "Delivered in 24 hours in sealed packaging. Very impressed with the quality!", date: "1 week ago" },
                { name: "Anand Verma", rating: 4, comment: language === "hi" ? "दालों और मसालों की बहुत अच्छी ताज़गी।" : "Good quality pulses and spices. Fresh harvest quality.", date: "2 weeks ago" },
              ].map((review, i) => (
                <div key={i} className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white">{review.name}</span>
                      <span className="ml-2 text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                        ✓ {language === "hi" ? "प्रमाणित ख़रीदार" : "Verified Purchase"}
                      </span>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(review.rating)].map((_, j) => (
                        <Star key={j} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">{review.comment}</p>
                  <p className="text-[10px] text-zinc-400 mt-1">{review.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== STICKY MOBILE BOTTOM ACTION BAR ===== */}
      <div className="lg:hidden fixed bottom-[52px] left-0 right-0 z-30 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-200/90 dark:border-zinc-800/90 px-3 py-2.5 flex items-center justify-between gap-2 shadow-[0_-6px_20px_rgba(0,0,0,0.12)]">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-zinc-900 dark:text-white">
              {formatCurrency(currentPrice * quantity)}
            </span>
            {selectedWeight && (
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                ({formatWeight(selectedWeight.weight)})
              </span>
            )}
          </div>
          <span className="text-[9px] text-zinc-400 font-medium">{dict.home.expressDelivery}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              toggleWishlist(product);
              toast.success(isWishlisted ? (language === "hi" ? "हटाया गया" : "Removed") : (language === "hi" ? "पसंदीदा सूची में जोड़ा गया ❤️" : "Wishlisted ❤️"));
            }}
            className={`p-2.5 rounded-xl border transition-all active:scale-95 ${
              isWishlisted
                ? "border-rose-500 bg-rose-500/10 text-rose-500"
                : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-rose-500" : ""}`} />
          </button>

          <button
            onClick={() => {
              addToCart(product, quantity, selectedVariant, selectedWeight);
              toast.success(`${dict.product.addedToCart} 🎉`);
            }}
            disabled={!isWeightInStock || currentWeightStock <= 0}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-xs uppercase tracking-wider shadow-md hover:from-amber-400 hover:to-amber-500 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isWeightInStock ? dict.product.addToCart : dict.common.outOfStock}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);

  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProductDetailContent slug={resolvedParams.slug} />
    </Suspense>
  );
}
