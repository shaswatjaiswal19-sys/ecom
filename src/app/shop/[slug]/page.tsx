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
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { Product } from "@/types";
import {
  Star, ShoppingBag, Heart, Share2, Shield, Truck, RefreshCw,
  ChevronRight, Package, Zap, BarChart3, Info, CheckCircle2, ZoomIn, Loader2
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
  const [liveProduct, setLiveProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const product =
    liveProduct ||
    products.find((p) => p.slug === slug || p.id === slug) ||
    MOCK_PRODUCTS.find((p) => p.slug === slug || p.id === slug);

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
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "reviews" | "360">(initialViewMode);

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

  const currentPrice = selectedVariant?.price || product.price;
  const isWishlisted = isInWishlist(product.id);
  const discount = Math.round(((product.mrp - currentPrice) / product.mrp) * 100);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8">
          <Link href="/" className="hover:text-amber-500 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-amber-500 transition-colors">Catalog</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/shop?category=${product.category.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-amber-500 transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-900 dark:text-white font-semibold truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          {/* ===== LEFT: Gallery Panel ===== */}
          <div className="space-y-4">
            {/* View Tabs */}
            <div className="flex gap-2">
              {["overview", "360", "specs", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                    activeTab === tab
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {tab === "360" ? "🔄 360° View" : tab}
                </button>
              ))}
            </div>

            {activeTab === "360" ? (
              <Product360Viewer images={product.images360 || product.images} productName={product.name} />
            ) : (
              <>
                {/* Main Image */}
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/10 group">
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  {discount > 0 && (
                    <div className="absolute top-4 left-4 bg-amber-500 text-black text-xs font-extrabold px-3 py-1.5 rounded-full shadow">
                      -{discount}% OFF
                    </div>
                  )}
                  <button className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-700 transition-colors shadow">
                    <ZoomIn className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                  </button>
                </div>

                {/* Thumbnails */}
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {(product.images || []).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative w-18 h-18 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                        selectedImage === i
                          ? "border-amber-500 shadow-md scale-105"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                      style={{ width: 72, height: 72 }}
                    >
                      <Image src={img} alt={`View ${i + 1}`} fill className="object-contain p-2" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ===== RIGHT: Product Info Panel ===== */}
          <div className="space-y-6">
            {/* Brand & Category */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-amber-500 uppercase tracking-widest">{product.brand}</span>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <span className="text-zinc-500">{product.category}</span>
              {product.has360View && (
                <span className="ml-1 text-[10px] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-2 py-0.5 rounded-full font-bold">
                  360° View
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl font-black text-zinc-900 dark:text-white leading-tight">{product.name}</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 italic">{product.tagline}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-amber-400" : "fill-zinc-200 dark:fill-zinc-700"}`} />
                ))}
              </div>
              <span className="text-sm font-bold text-zinc-900 dark:text-white">{product.rating}</span>
              <span className="text-xs text-zinc-400">({product.reviewCount} verified reviews)</span>
            </div>

            {/* Pricing Block */}
            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/10">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-black text-zinc-900 dark:text-white">
                  {formatCurrency(currentPrice)}
                </span>
                {product.mrp > currentPrice && (
                  <>
                    <span className="text-lg text-zinc-400 line-through">{formatCurrency(product.mrp)}</span>
                    <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                      Save {formatCurrency(product.mrp - currentPrice)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Inclusive of 18% GST • Wholesale: {formatCurrency(product.wholesalePrice)} (B2B)
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${product.inStock ? "bg-emerald-500" : "bg-rose-500"} animate-pulse`} />
                  <span className={`text-xs font-bold ${product.inStock ? "text-emerald-500" : "text-rose-500"}`}>
                    {product.inStock ? `In Stock (${product.stock} ${product.unit || "kg"} available)` : "Out of Stock"}
                  </span>
                </div>
                {product.weight && (
                  <span className="text-xs font-extrabold bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    Net Pack: {product.weight}
                  </span>
                )}
              </div>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-3">
                  Select Finish / Variant:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`relative px-4 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                        selectedVariant?.id === v.id
                          ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400 scale-105 shadow-md"
                          : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600"
                      }`}
                    >
                      {v.color && (
                        <span
                          className="inline-block w-3 h-3 rounded-full mr-1.5 border border-black/10"
                          style={{ backgroundColor: v.color }}
                        />
                      )}
                      {v.name}
                      {selectedVariant?.id === v.id && (
                        <CheckCircle2 className="w-3 h-3 absolute -top-1 -right-1 text-amber-500 fill-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Qty:</label>
              <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 bg-white dark:bg-zinc-900">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors font-bold text-lg w-5"
                >
                  −
                </button>
                <span className="font-black text-zinc-900 dark:text-white w-8 text-center tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors font-bold text-lg w-5"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  addToCart(product, quantity, selectedVariant);
                  toast.success("Added to Cart — Luxury Confirmed! 🎉");
                }}
                disabled={!product.inStock}
                className="flex-1 py-4 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold text-sm hover:bg-amber-500 hover:text-black dark:hover:bg-amber-400 dark:hover:text-black transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5" /> Add to Cart
              </button>
              <button
                onClick={() => {
                  toggleWishlist(product);
                  toast.success(isWishlisted ? "Removed from Wishlist" : "Saved to Wishlist ❤️");
                }}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  isWishlisted
                    ? "border-rose-500 bg-rose-500/10 text-rose-500"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-rose-500 hover:text-rose-500"
                }`}
                title="Add to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-rose-500" : ""}`} />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Product link copied!");
                }}
                className="p-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-amber-500 hover:text-amber-500 transition-all"
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              {[
                { icon: Shield, label: "2-Year Warranty", sub: "Direct from brand" },
                { icon: Truck, label: "Free Shipping", sub: "All India delivery" },
                { icon: RefreshCw, label: "7-Day Return", sub: "Easy replacement" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/10">
                  <Icon className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
                  <div className="text-[11px] font-bold text-zinc-900 dark:text-white">{label}</div>
                  <div className="text-[10px] text-zinc-500">{sub}</div>
                </div>
              ))}
            </div>

            {/* SKU & Stock info */}
            <div className="text-xs text-zinc-400 space-y-1 pt-2">
              <p>SKU: <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">{selectedVariant?.sku || product.sku}</span></p>
              <p>Barcode: <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">{product.barcode}</span></p>
              <p>Weight: {product.weight} • Dimensions: {product.dimensions}</p>
            </div>
          </div>
        </div>

        {/* ===== PRODUCT TABS ===== */}
        <div className="mt-16">
          <div className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800 mb-8 overflow-x-auto">
            {["overview", "specs", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap capitalize ${
                  activeTab === tab
                    ? "border-amber-500 text-amber-600 dark:text-amber-400"
                    : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {tab === "overview" && <Info className="w-4 h-4 inline mr-1.5" />}
                {tab === "specs" && <BarChart3 className="w-4 h-4 inline mr-1.5" />}
                {tab === "reviews" && <Star className="w-4 h-4 inline mr-1.5" />}
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-3">Product Description</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{product.description}</p>
                </div>
                <div>
                  <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" /> Key Highlights
                  </h3>
                  <ul className="space-y-2">
                    {(product.highlights || []).map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-500" /> What&apos;s in the Box
                </h3>
                <ul className="space-y-2">
                  {(product.features || []).map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                      <span className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold flex items-center justify-center text-zinc-700 dark:text-zinc-300 flex-shrink-0">
                        {i + 1}
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="max-w-2xl">
              <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-6">Technical Specifications</h3>
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
                {(product.specifications || []).map((spec, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-2 gap-4 px-6 py-4 text-sm ${
                      i % 2 === 0 ? "bg-zinc-50 dark:bg-zinc-900" : "bg-white dark:bg-zinc-950"
                    }`}
                  >
                    <span className="font-semibold text-zinc-500 dark:text-zinc-400">{spec.key}</span>
                    <span className="font-bold text-zinc-900 dark:text-white">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="max-w-3xl">
              <div className="flex items-center gap-6 mb-8 p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-black/5 dark:border-white/10">
                <div className="text-center">
                  <div className="text-5xl font-black text-zinc-900 dark:text-white">{product.rating}</div>
                  <div className="flex text-amber-400 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">{product.reviewCount} Reviews</div>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500 w-3">{star}</span>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: star === 5 ? "75%" : star === 4 ? "18%" : "7%" }}
                        />
                      </div>
                      <span className="text-xs text-zinc-400">{star === 5 ? "75%" : star === 4 ? "18%" : "7%"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-6">
                {[
                  { name: "Rajesh K.", rating: 5, comment: "Absolutely world-class product. The build quality is exceptional and performance is flawless.", date: "2026-07-20" },
                  { name: "Sunita M.", rating: 5, comment: "Exceeded all my expectations. The packaging itself is a luxury experience. Highly recommend!", date: "2026-07-15" },
                ].map((review, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="font-bold text-sm text-zinc-900 dark:text-white">{review.name}</span>
                        <span className="ml-2 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                          ✓ Verified Purchase
                        </span>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(review.rating)].map((_, j) => (
                          <Star key={j} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{review.comment}</p>
                    <p className="text-[10px] text-zinc-400 mt-2">{review.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
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
