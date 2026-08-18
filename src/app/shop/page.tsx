"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/shop/ProductCard";
import QuickViewModal from "@/components/shop/QuickViewModal";
import { MOCK_BRANDS } from "@/lib/mockData";
import { useProductStore, useCategoryStore, useBrandStore } from "@/lib/store";
import { getProductsFromStore, getCategoriesFromStore } from "@/lib/firestore";
import { Product } from "@/types";
import { Search, SlidersHorizontal, Grid3X3, List, X, ChevronDown, Sparkles } from "lucide-react";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest Harvest First" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const { products: storeProducts, setProducts } = useProductStore();
  const { categories: storeCategories, setCategories: storeSetCategories } = useCategoryStore();
  const { brands: storeBrands } = useBrandStore();

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          getProductsFromStore().then((live) => {
            setProducts(live || []);
          });
        }
      })
      .catch(() => {
        getProductsFromStore().then((live) => {
          setProducts(live || []);
        });
      });

    fetch("/api/categories", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          storeSetCategories(data.categories);
        } else {
          getCategoriesFromStore().then((liveCats) => {
            if (liveCats && liveCats.length > 0) storeSetCategories(liveCats);
          }).catch(() => {});
        }
      })
      .catch(() => {
        getCategoriesFromStore().then((liveCats) => {
          if (liveCats && liveCats.length > 0) storeSetCategories(liveCats);
        }).catch(() => {});
      });
  }, [setProducts, storeSetCategories]);
  const categoriesList = storeCategories;
  const brandsList = storeBrands.length ? storeBrands : MOCK_BRANDS;
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get("brand") || "");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);

  const filtered = useMemo(() => {
    let products = [...storeProducts];

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      products = products.filter(
        (p) =>
          p.category.toLowerCase() === selectedCategory.toLowerCase() ||
          p.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (selectedBrand) {
      products = products.filter((p) => p.brand.toLowerCase().includes(selectedBrand.toLowerCase()));
    }

    if (inStockOnly) {
      products = products.filter((p) => p.inStock);
    }

    products = products.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (minRating > 0) {
      products = products.filter((p) => p.rating >= minRating);
    }

    switch (sortBy) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        products.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return products;
  }, [search, selectedCategory, selectedBrand, priceRange, minRating, sortBy, inStockOnly]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedBrand("");
    setPriceRange([0, 5000]);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy("featured");
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-4 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4 sm:pb-6">
        <div>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Manoj Supermarket Catalog
          </span>
          <h1 className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-1">Fresh Groceries & Organic Staples</h1>
          <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Showing {filtered.length} farm-harvested products
          </p>
        </div>

        {/* View mode & Sort */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" /> Filters
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-900 dark:text-white outline-none focus:border-amber-500"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                Sort: {o.label}
              </option>
            ))}
          </select>

          <div className="hidden sm:flex items-center border border-zinc-200 dark:border-zinc-800 rounded-2xl p-1 bg-zinc-50 dark:bg-zinc-900">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl transition-all ${
                viewMode === "grid"
                  ? "bg-amber-500 text-black shadow-sm"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
              title="Grid View"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-xl transition-all ${
                viewMode === "list"
                  ? "bg-amber-500 text-black shadow-sm"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ONE-TAP HORIZONTAL CATEGORY PILL BAR (Flipkart/Amazon style) */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all border shadow-xs ${
            !selectedCategory
              ? "bg-amber-500 text-black border-amber-500 shadow-amber-500/20"
              : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
          }`}
        >
          All Items
        </button>
        {categoriesList.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.name)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border shadow-xs ${
              selectedCategory.toLowerCase() === c.name.toLowerCase()
                ? "bg-amber-500 text-black border-amber-500 font-black shadow-amber-500/20"
                : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
        {/* Sidebar Filters (Desktop & Mobile Drawer) */}
        <aside className={`lg:block ${filterOpen ? "block" : "hidden"} space-y-6`}>
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 border border-black/5 dark:border-white/10 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm uppercase tracking-wider text-zinc-900 dark:text-white">Filter Groceries</h3>
              <button onClick={clearFilters} className="text-xs font-bold text-amber-500 hover:underline">
                Reset All
              </button>
            </div>

            {/* Search Filter */}
            <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950 px-3.5 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <Search className="w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Filter by keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none text-xs outline-none text-zinc-900 dark:text-white w-full"
              />
            </div>

            {/* Categories Filter */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-zinc-400">Categories</h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    !selectedCategory ? "bg-amber-500 text-black" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  All Aisle Categories
                </button>
                {categoriesList.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.name)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedCategory.toLowerCase() === c.name.toLowerCase()
                        ? "bg-amber-500 text-black"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-900 dark:text-white">
                <span>Price Range</span>
                <span className="text-amber-500">₹0 - ₹{priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </aside>

        {/* Product Grid / List */}
        <main className="lg:col-span-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-black/5 dark:border-white/10 space-y-4">
              <div className="text-4xl">🌾</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white">No products found matching filters</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Try clearing your search terms or adjusting the category and price filters.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 rounded-2xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6" : "space-y-3 sm:space-y-4"}>
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold text-amber-500">Loading Grocery Catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
