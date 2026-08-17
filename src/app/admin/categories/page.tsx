"use client";

import { useState, useEffect } from "react";
import { useCategoryStore, useBrandStore, useProductStore } from "@/lib/store";
import { Category, Brand } from "@/types";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Apple,
  Milk,
  Wheat,
  Flame,
  Coffee,
  Carrot,
  Leaf,
  LayoutList,
  LayoutGrid,
} from "lucide-react";
import toast from "react-hot-toast";

const ICON_OPTIONS = [
  { name: "Apple", icon: Apple },
  { name: "Milk", icon: Milk },
  { name: "Wheat", icon: Wheat },
  { name: "Flame", icon: Flame },
  { name: "Coffee", icon: Coffee },
  { name: "Carrot", icon: Carrot },
  { name: "Leaf", icon: Leaf },
  { name: "Sparkles", icon: Sparkles },
];

export default function AdminCategoriesPage() {
  const { categories, setCategories, addCategory, deleteCategory } = useCategoryStore();
  const { brands, addBrand, deleteBrand } = useBrandStore();
  const { products } = useProductStore();

  useEffect(() => {
    fetch("/api/categories", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      })
      .catch(() => {});
  }, [setCategories]);

  const [activeTab, setActiveTab] = useState<"categories" | "brands">("categories");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Category Form State
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatImage, setNewCatImage] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Apple");

  // Brand Form State
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandDesc, setNewBrandDesc] = useState("");
  const [newBrandLogo, setNewBrandLogo] = useState("");

  // Add Category Handler
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    const created: Category = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      slug: newCatName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      description: newCatDesc.trim() || "100% Certified Farm-Fresh Organic Collection",
      image:
        newCatImage.trim() ||
        "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800",
      icon: selectedIcon,
      itemCount: 0,
      featured: true,
    };

    addCategory(created);

    // Sync in background with API
    fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(created),
    }).catch(() => {});

    setNewCatName("");
    setNewCatDesc("");
    setNewCatImage("");
    toast.success(`Category "${created.name}" created and saved! 🎉`);
  };

  // Delete Category Handler
  const handleDeleteCategory = (cat: Category) => {
    if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      deleteCategory(cat.id);
      fetch(`/api/categories?id=${cat.id}`, { method: "DELETE" }).catch(() => {});
      toast.success(`Category "${cat.name}" removed from catalog`);
    }
  };

  // Add Brand Handler
  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) {
      toast.error("Please enter a brand name");
      return;
    }

    const created: Brand = {
      id: `br-${Date.now()}`,
      name: newBrandName.trim(),
      logo:
        newBrandLogo.trim() ||
        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200",
      description: newBrandDesc.trim() || "Official Certified Organic Producer",
      featured: true,
    };

    addBrand(created);

    // Sync in background with API
    fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "brand", ...created }),
    }).catch(() => {});

    setNewBrandName("");
    setNewBrandDesc("");
    setNewBrandLogo("");
    toast.success(`Brand "${created.name}" registered and saved! 🎉`);
  };

  // Delete Brand Handler
  const handleDeleteBrand = (brand: Brand) => {
    if (confirm(`Are you sure you want to delete brand "${brand.name}"?`)) {
      deleteBrand(brand.id);
      fetch(`/api/categories?id=${brand.id}&type=brand`, { method: "DELETE" }).catch(() => {});
      toast.success(`Brand "${brand.name}" removed from registry`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">Categories & Brands</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Manage your store collections, organic departments, and certified partner brands.
          </p>
        </div>
      </div>

      {/* Tabs & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <div className="flex">
          <button
            onClick={() => setActiveTab("categories")}
            className={`pb-4 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "categories"
                ? "border-amber-500 text-amber-500"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab("brands")}
            className={`pb-4 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "brands"
                ? "border-amber-500 text-amber-500"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Brands ({brands.length})
          </button>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-700 mb-3 sm:mb-0">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === "list"
                ? "bg-amber-500 text-black shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
            title="List View"
          >
            <LayoutList className="w-4 h-4" />
            <span>List</span>
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === "grid"
                ? "bg-amber-500 text-black shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Grid</span>
          </button>
        </div>
      </div>

      {/* Categories View */}
      {activeTab === "categories" ? (
        <div className="space-y-6">
          {/* Add Category Card */}
          <form
            onSubmit={handleAddCategory}
            className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
              <Plus className="w-4 h-4 text-amber-500" /> Create New Organic Category
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Category Name (e.g. Exotic Fruits) *"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
              />
              <input
                type="text"
                placeholder="Short Description"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
              />
              <input
                type="url"
                placeholder="Image URL (optional)"
                value={newCatImage}
                onChange={(e) => setNewCatImage(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
              />
            </div>

            {/* Icon Selector */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs font-semibold text-zinc-500">Select Icon:</span>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map(({ name, icon: IconComp }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedIcon(name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      selectedIcon === name
                        ? "bg-amber-500 text-black font-bold shadow-sm"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{name}</span>
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="ml-auto px-6 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 flex items-center gap-2 shadow-md shadow-amber-500/20"
              >
                <Plus className="w-4 h-4" /> Save Category
              </button>
            </div>
          </form>

          {/* Categories Render (List or Grid) */}
          {viewMode === "list" ? (
            <div className="space-y-3">
              {categories.map((cat) => {
                const liveCount = products.filter(
                  (p) =>
                    p.category.toLowerCase() === cat.name.toLowerCase() ||
                    p.category.toLowerCase().includes(cat.slug)
                ).length;

                return (
                  <div
                    key={cat.id}
                    className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-zinc-100 dark:border-zinc-800 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base truncate">
                            {cat.name}
                          </h3>
                          <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            /{cat.slug}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{cat.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-100 dark:border-zinc-800">
                      <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        {liveCount > 0 ? `${liveCount} Products` : `${cat.itemCount || 0} Products`}
                      </span>

                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition-all text-xs font-semibold"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => {
                const liveCount = products.filter(
                  (p) =>
                    p.category.toLowerCase() === cat.name.toLowerCase() ||
                    p.category.toLowerCase().includes(cat.slug)
                ).length;

                return (
                  <div
                    key={cat.id}
                    className="bg-white dark:bg-zinc-900 rounded-3xl border border-black/5 dark:border-white/10 p-6 shadow-sm overflow-hidden flex flex-col justify-between group hover:border-amber-500/40 transition-all space-y-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-zinc-100 dark:border-zinc-800 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-zinc-900 dark:text-white text-base truncate">{cat.name}</h3>
                        <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{cat.description}</p>
                        <span className="text-[10px] font-bold text-amber-500 uppercase mt-2 block tracking-wider">
                          {liveCount > 0 ? `${liveCount} Products in Stock` : `${cat.itemCount || 0} Products Listed`}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-zinc-400">Slug: /{cat.slug}</span>
                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition-all text-xs font-semibold"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Category</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Brands View */
        <div className="space-y-6">
          {/* Add Brand Form */}
          <form
            onSubmit={handleAddBrand}
            className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
              <Plus className="w-4 h-4 text-amber-500" /> Register Partner Brand
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Brand Name *"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
              />
              <input
                type="text"
                placeholder="Brand Tagline / Description"
                value={newBrandDesc}
                onChange={(e) => setNewBrandDesc(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
              />
              <input
                type="url"
                placeholder="Logo URL (optional)"
                value={newBrandLogo}
                onChange={(e) => setNewBrandLogo(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 flex items-center gap-2 shadow-md shadow-amber-500/20"
              >
                <Plus className="w-4 h-4" /> Save Brand
              </button>
            </div>
          </form>

          {/* Brands Render (List or Grid) */}
          {viewMode === "list" ? (
            <div className="space-y-3">
              {brands.map((br) => (
                <div
                  key={br.id}
                  className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <img
                      src={br.logo}
                      alt={br.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-zinc-100 dark:border-zinc-800 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base truncate">
                        {br.name}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{br.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => handleDeleteBrand(br)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition-all text-xs font-semibold"
                      title="Delete Brand"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {brands.map((br) => (
                <div
                  key={br.id}
                  className="bg-white dark:bg-zinc-900 rounded-3xl border border-black/5 dark:border-white/10 p-6 shadow-sm flex flex-col justify-between group hover:border-amber-500/40 transition-all text-center space-y-4"
                >
                  <div className="space-y-3">
                    <img
                      src={br.logo}
                      alt={br.name}
                      className="w-16 h-16 rounded-2xl object-cover mx-auto border border-zinc-200 dark:border-zinc-800"
                    />
                    <div>
                      <h3 className="font-bold text-zinc-900 dark:text-white text-base">{br.name}</h3>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{br.description}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-center">
                    <button
                      onClick={() => handleDeleteBrand(br)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition-all text-xs font-semibold"
                      title="Delete Brand"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Brand</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
