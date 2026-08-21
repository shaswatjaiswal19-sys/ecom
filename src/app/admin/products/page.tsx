"use client";

import { useState, useEffect, useCallback } from "react";
import { useProductStore, useCategoryStore, useBrandStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Product, ProductWeightOption } from "@/types";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import {
  getProductsFromStore,
  createProductInFirestore,
  updateProductInFirestore,
  deleteProductInFirestore,
} from "@/lib/firestore";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  Sparkles,
  X,
  Image as ImageIcon,
  CheckCircle2,
  Upload,
  AlertCircle,
  RefreshCw,
  LayoutList,
  LayoutGrid,
  Table as TableIcon,
  ExternalLink,
  Layers,
  PlusCircle,
  PackageCheck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

import {
  GROCERY_CATEGORIES,
  GROCERY_BRANDS,
  GROCERY_UNITS,
  STANDARD_GRAMS_PRESETS,
  LIQUID_VOLUME_PRESETS,
  BULK_STAPLE_PRESETS,
  WeightPreset,
} from "@/lib/constants/grocery";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function AdminProductsPage() {
  const { products, setProducts, addProduct, updateProduct, deleteProduct, resetProducts } = useProductStore();
  const { categories: customCategories } = useCategoryStore();
  const { brands: customBrands } = useBrandStore();
  const { dict, language } = useLanguage();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProducts = useCallback(async (showToast = false) => {
    setIsRefreshing(true);
    try {
      // 1. Fetch from server API endpoint
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
        if (showToast) toast.success(`Synced ${data.products.length} products from database!`);
        return;
      }

      // 2. Direct Firestore fallback
      const liveProducts = await getProductsFromStore();
      setProducts(liveProducts || []);
      if (showToast) toast.success(`Synced ${liveProducts?.length || 0} products from database!`);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      try {
        const liveProducts = await getProductsFromStore();
        setProducts(liveProducts || []);
      } catch {}
    } finally {
      setIsRefreshing(false);
    }
  }, [setProducts]);

  useEffect(() => {
    fetchProducts();

    // Set up real-time listener for Firestore products
    let unsubscribe: () => void = () => {};
    try {
      unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
        const liveProducts: Product[] = [];
        snapshot.forEach((docSnap) => {
          liveProducts.push({ id: docSnap.id, ...docSnap.data() } as Product);
        });
        if (liveProducts.length > 0) {
          getProductsFromStore().then((merged) => {
            if (merged && merged.length > 0) setProducts(merged);
          }).catch(() => {});
        }
      });
    } catch (err) {
      console.error("Firestore onSnapshot products error:", err);
    }

    return () => unsubscribe();
  }, [fetchProducts, setProducts]);

  const allCategories = Array.from(
    new Set([...customCategories.map((c) => c.name), ...GROCERY_CATEGORIES])
  );
  const allBrands = Array.from(
    new Set([...customBrands.map((b) => b.name), ...GROCERY_BRANDS])
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "table" | "grid">("list");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    nameHi?: string;
    slug: string;
    tagline: string;
    taglineHi?: string;
    description: string;
    descriptionHi?: string;
    category: string;
    brand: string;
    price: number;
    mrp: number;
    stock: number;
    unit: string;
    weight: string;
    weightOptions: ProductWeightOption[];
    sku: string;
    gstPercentage: number;
    images: string[];
    isFlashSale: boolean;
    has360View: boolean;
    inStock: boolean;
  }>({
    name: "",
    nameHi: "",
    slug: "",
    tagline: "",
    taglineHi: "",
    description: "",
    descriptionHi: "",
    category: GROCERY_CATEGORIES[0],
    brand: GROCERY_BRANDS[0],
    price: 0,
    mrp: 0,
    stock: 10,
    unit: "kg",
    weight: "1 kg",
    weightOptions: [],
    sku: "",
    gstPercentage: 5,
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800",
    ],
    isFlashSale: false,
    has360View: false,
    inStock: true,
  });

  const [imageUrlInput, setImageUrlInput] = useState("");

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.nameHi && p.nameHi.toLowerCase().includes(searchTerm.toLowerCase())) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Open modal for Adding new product
  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setFormData({
      name: "",
      nameHi: "",
      slug: "",
      tagline: "100% Farm Fresh & Organic",
      taglineHi: "100% शुद्ध और जैविक",
      description: "Carefully harvested from certified organic farms with zero chemical pesticides.",
      descriptionHi: "प्रमाणित जैविक खेतों से बिना किसी रासायनिक कीटनाशक के ताज़ा तैयार।",
      category: GROCERY_CATEGORIES[0],
      brand: GROCERY_BRANDS[0],
      price: 299,
      mrp: 399,
      stock: 50,
      unit: "kg",
      weight: "1 kg",
      weightOptions: STANDARD_GRAMS_PRESETS.map((preset) => ({
        id: `wt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        weight: preset.weight,
        price: Math.round(299 * preset.factor),
        mrp: Math.round(399 * preset.factor),
        stock: 50,
      })),
      sku: `SKU-MT-${Math.floor(1000 + Math.random() * 9000)}`,
      gstPercentage: 5,
      images: [
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800",
      ],
      isFlashSale: false,
      has360View: false,
      inStock: true,
    });
    setIsModalOpen(true);
  };

  // Open modal for Editing existing product
  const handleOpenEditModal = (product: Product) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      nameHi: product.nameHi || "",
      slug: product.slug,
      tagline: product.tagline || "",
      taglineHi: product.taglineHi || "",
      description: product.description || "",
      descriptionHi: product.descriptionHi || "",
      category: product.category,
      brand: product.brand,
      price: product.price,
      mrp: product.mrp,
      stock: product.stock,
      unit: product.unit || (product.weight ? product.weight.split(" ")[1] || "kg" : "kg"),
      weight: product.weight || "1 kg",
      weightOptions: product.weightOptions ? product.weightOptions.map((w) => ({ ...w, stock: Number(w.stock ?? 0) })) : [],
      sku: product.sku,
      gstPercentage: product.gstPercentage || 5,
      images: product.images.length > 0 ? [...product.images] : [
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800",
      ],
      isFlashSale: !!product.isFlashSale,
      has360View: !!product.has360View,
      inStock: product.inStock,
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    deleteProduct(id);
    await deleteProductInFirestore(id);
    fetch(`/api/products?id=${id}`, { method: "DELETE" }).catch(() => {});
    toast.success("Product removed from catalog");
  };

  // Add Image URL to Gallery
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    if (!imageUrlInput.startsWith("http")) {
      toast.error("Please enter a valid image URL starting with http:// or https://");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()],
    }));
    setImageUrlInput("");
    toast.success("Image added to product gallery!");
  };

  // Remove Image from Gallery
  const handleRemoveImage = (indexToRemove: number) => {
    if (formData.images.length <= 1) {
      toast.error("Product must have at least 1 image");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // Add a new custom weight option
  const handleAddWeightOption = () => {
    const newOpt: ProductWeightOption = {
      id: `wt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      weight: "250 grams",
      price: formData.price || 100,
      mrp: formData.mrp || Math.round((formData.price || 100) * 1.25),
      stock: 50,
    };
    setFormData((prev) => ({
      ...prev,
      weightOptions: [...prev.weightOptions, newOpt],
    }));
    toast.success("Added new weight option row");
  };

  // Remove a weight option
  const handleRemoveWeightOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      weightOptions: prev.weightOptions.filter((_, i) => i !== index),
    }));
  };

  // Update a field on a specific weight option
  const handleUpdateWeightOption = (
    index: number,
    field: keyof ProductWeightOption,
    value: string | number
  ) => {
    setFormData((prev) => {
      const updated = [...prev.weightOptions];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return { ...prev, weightOptions: updated };
    });
  };

  // Apply a batch preset list (e.g. Standard Grams 25g..1kg)
  const handleApplyWeightPresets = (presets: WeightPreset[]) => {
    const basePrice = formData.price || 299;
    const baseMrp = formData.mrp || Math.round(basePrice * 1.25);
    const generated: ProductWeightOption[] = presets.map((p) => ({
      id: `wt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      weight: p.weight,
      price: Math.max(1, Math.round(basePrice * p.factor)),
      mrp: Math.max(1, Math.round(baseMrp * p.factor)),
      stock: 50,
    }));
    setFormData((prev) => ({
      ...prev,
      weightOptions: generated,
    }));
    toast.success(`Applied ${presets.length} weight presets with separate stock! 🎉`);
  };

  // Clear all weight options
  const handleClearAllWeights = () => {
    setFormData((prev) => ({
      ...prev,
      weightOptions: [],
    }));
    toast.success("Cleared weight options");
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error("Please fill in Product Name and Price");
      return;
    }

    const calculatedSlug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const cleanedWeightOptions = formData.weightOptions.map((opt) => ({
      ...opt,
      price: Number(opt.price || 0),
      mrp: opt.mrp ? Number(opt.mrp) : undefined,
      stock: Number(opt.stock ?? 0),
    }));

    const computedStock = cleanedWeightOptions.length > 0
      ? cleanedWeightOptions.reduce((sum, w) => sum + Number(w.stock || 0), 0)
      : Number(formData.stock || 0);

    const isInStock = computedStock > 0 && (formData.inStock ?? true);

    if (editingProductId) {
      // Edit existing product
      const existingProduct = products.find((p) => p.id === editingProductId);
      if (existingProduct) {
        const updatedProduct: Product = {
          ...existingProduct,
          name: formData.name,
          nameHi: formData.nameHi?.trim() || undefined,
          slug: calculatedSlug,
          tagline: formData.tagline,
          taglineHi: formData.taglineHi?.trim() || undefined,
          description: formData.description,
          descriptionHi: formData.descriptionHi?.trim() || undefined,
          category: formData.category,
          brand: formData.brand,
          price: Number(formData.price),
          mrp: Number(formData.mrp) || Number(formData.price) * 1.25,
          stock: computedStock,
          unit: formData.unit || "kg",
          weight: formData.weight || `1 ${formData.unit || "kg"}`,
          weightOptions: cleanedWeightOptions.length > 0 ? cleanedWeightOptions : undefined,
          sku: formData.sku,
          gstPercentage: Number(formData.gstPercentage),
          images: formData.images,
          isFlashSale: formData.isFlashSale,
          has360View: formData.has360View,
          inStock: isInStock,
          specifications: existingProduct.specifications || [],
          updatedAt: new Date().toISOString(),
        };
        updateProduct(editingProductId, updatedProduct);
        await updateProductInFirestore(editingProductId, updatedProduct);
        fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProduct),
        }).catch(() => {});
        toast.success("Product updated successfully with weight-specific stock! 🎉");
      }
    } else {
      // Create new product
      const newCreatedProduct: Product = {
        id: `prod-${Date.now()}`,
        name: formData.name,
        nameHi: formData.nameHi?.trim() || undefined,
        slug: calculatedSlug,
        tagline: formData.tagline || "Organic & Farm Fresh",
        taglineHi: formData.taglineHi?.trim() || undefined,
        description: formData.description || "100% natural, farm-fresh organic grocery product.",
        descriptionHi: formData.descriptionHi?.trim() || undefined,
        highlights: ["100% Organic Certified", "Farm Direct", "Zero Preservatives"],
        features: ["Freshly Harvested", "Hygienically Packed", "24-Hour Express Delivery"],
        price: Number(formData.price),
        mrp: Number(formData.mrp) || Number(formData.price) * 1.25,
        wholesalePrice: Number(formData.price) * 0.85,
        discountPercentage: Math.round(((formData.mrp - formData.price) / formData.mrp) * 100) || 10,
        gstPercentage: Number(formData.gstPercentage),
        category: formData.category,
        brand: formData.brand,
        sku: formData.sku || `SKU-MT-${Math.floor(1000 + Math.random() * 9000)}`,
        barcode: `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        stock: computedStock,
        unit: formData.unit || "kg",
        inStock: isInStock,
        weight: formData.weight || `1 ${formData.unit || "kg"}`,
        weightOptions: cleanedWeightOptions.length > 0 ? cleanedWeightOptions : undefined,
        dimensions: "15x10x20 cm",
        images: formData.images,
        rating: 5.0,
        reviewCount: 1,
        tags: ["organic", "grocery"],
        isFlashSale: formData.isFlashSale,
        has360View: formData.has360View,
        specifications: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addProduct(newCreatedProduct);
      await createProductInFirestore(newCreatedProduct);
      fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCreatedProduct),
      }).catch(() => {});
      toast.success("New product published with weight-specific stock! 🎉");
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">Product Catalog</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Manage inventory, images, prices, categories, and stock for Manoj Traders.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Search, Category Filters & View Switcher */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm">
        {/* Search Input */}
        <div className="flex-1 flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl px-4 py-2.5 w-full">
          <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by product title or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-zinc-900 dark:text-white w-full placeholder:text-zinc-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Category Dropdown */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <Filter className="w-4 h-4 text-zinc-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs font-semibold rounded-2xl px-4 py-2.5 outline-none cursor-pointer w-full sm:w-auto"
            >
              <option value="all">All Grocery Categories ({products.length})</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Switcher (List / Table / Grid) */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
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
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === "table"
                  ? "bg-amber-500 text-black shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
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
      </div>

      {/* 1. LIST VIEW (Default High-Efficiency View) */}
      {viewMode === "list" && (
        <div className="space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center text-zinc-500 border border-black/5 dark:border-white/10">
              No products found matching your search.
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-5 border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                {/* Product Info & Thumbnail */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 border border-zinc-200 dark:border-zinc-700">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <Package className="w-8 h-8 m-4 text-zinc-400" />
                    )}
                    {p.isFlashSale && (
                      <span className="absolute top-1 left-1 bg-amber-500 text-zinc-950 font-black text-[8px] px-1.5 py-0.5 rounded-md">
                        FLASH
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/shop/${p.slug}`}
                        target="_blank"
                        className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white hover:text-amber-500 transition-colors truncate flex items-center gap-1.5"
                      >
                        <span>{p.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                        {p.category}
                      </span>
                      <span className="text-zinc-400">•</span>
                      <span className="font-semibold text-zinc-600 dark:text-zinc-400 text-[11px]">{p.brand}</span>
                      <span className="text-zinc-400">•</span>
                      <span className="font-mono text-[10px] text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                        SKU: {p.sku}
                      </span>
                      {p.weightOptions && p.weightOptions.length > 0 && (
                        <>
                          <span className="text-zinc-400">•</span>
                          <span className="bg-amber-500/10 text-amber-700 dark:text-amber-300 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                            <PackageCheck className="w-3 h-3 text-amber-500" />
                            {p.weightOptions.length} Weight Variants
                          </span>
                        </>
                      )}
                    </div>

                    {/* Weight-Specific Inventory Breakdown Chips */}
                    {p.weightOptions && p.weightOptions.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                        {p.weightOptions.map((opt) => (
                          <span
                            key={opt.id}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                              (opt.stock ?? 0) > 10
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                                : (opt.stock ?? 0) > 0
                                ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                            }`}
                          >
                            <span>{opt.weight}:</span>
                            <span className="font-black underline">
                              {(opt.stock ?? 0) > 0 ? `${opt.stock} in stock` : "0 (Out of stock)"}
                            </span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Stock, Price & Actions */}
                <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 sm:gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-zinc-100 dark:border-zinc-800">
                  {/* Stock Level with Status Badge */}
                  <div className="text-left md:text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          p.stock > 10 ? "bg-emerald-500" : p.stock > 0 ? "bg-amber-500" : "bg-rose-500"
                        }`}
                      />
                      <span
                        className={`text-[10px] font-extrabold uppercase ${
                          p.stock > 10
                            ? "text-emerald-600 dark:text-emerald-400"
                            : p.stock > 0
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {p.stock > 10 ? "In Stock" : p.stock > 0 ? "Low Stock" : "Out of Stock"}
                      </span>
                    </div>
                    <div className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Total: {p.stock} units
                    </div>
                    {p.weight && (
                      <div className="text-[10px] text-zinc-400 font-medium">
                        Base: {p.weight}
                      </div>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="text-left md:text-right">
                    <div className="font-black text-base text-zinc-900 dark:text-white">
                      {formatCurrency(p.price)}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                      <span className="line-through">{formatCurrency(p.mrp)}</span>
                      {p.mrp > p.price && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {Math.round(((p.mrp - p.price) / p.mrp) * 100)}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(p)}
                      className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-700 dark:text-zinc-300 transition-colors"
                      title="Edit Product Details"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. TABLE VIEW */}
      {viewMode === "table" && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price & MRP</th>
                  <th className="px-6 py-4">Stock & Unit</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                      No products found in this category.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 border border-zinc-200 dark:border-zinc-700">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-6 h-6 m-3 text-zinc-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                            {p.name}
                            {p.isFlashSale && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-black font-extrabold">FLASH</span>}
                          </div>
                          <div className="text-[11px] text-zinc-400">{p.brand} {p.weight && `• ${p.weight}`}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-1 rounded-full font-bold text-[10px]">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-black text-sm text-zinc-900 dark:text-white">{formatCurrency(p.price)}</div>
                        <div className="text-[10px] text-zinc-400 line-through">{formatCurrency(p.mrp)}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-[11px] text-zinc-500">
                        <div>SKU: {p.sku}</div>
                        <div className="font-bold text-zinc-700 dark:text-zinc-300">
                          Total: {p.stock} units
                        </div>
                        {p.weightOptions && p.weightOptions.length > 0 ? (
                          <div className="flex flex-col gap-1 mt-1 font-sans">
                            {p.weightOptions.map((w) => (
                              <span
                                key={w.id}
                                className={`text-[10px] px-1.5 py-0.5 rounded font-bold inline-flex items-center gap-1 ${
                                  (w.stock ?? 0) > 10
                                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                    : (w.stock ?? 0) > 0
                                    ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                }`}
                              >
                                {w.weight}: <strong>{w.stock ?? 0}</strong>
                              </span>
                            ))}
                          </div>
                        ) : (
                          p.weight && <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">{p.weight}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            p.stock > 10
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : p.stock > 0
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {p.stock > 10 ? "In Stock" : p.stock > 0 ? "Low Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-black transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. GRID VIEW */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center text-zinc-500 border border-black/5 dark:border-white/10">
              No products found in this category.
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-zinc-900 rounded-3xl border border-black/5 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col group"
              >
                {/* Image */}
                <div className="relative h-48 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-zinc-400" />
                    </div>
                  )}
                  {p.isFlashSale && (
                    <span className="absolute top-3 left-3 bg-amber-500 text-zinc-950 font-black text-[10px] px-2.5 py-1 rounded-full shadow-md">
                      FLASH SALE
                    </span>
                  )}
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md ${
                      p.stock > 10
                        ? "bg-emerald-500 text-white"
                        : p.stock > 0
                        ? "bg-amber-500 text-zinc-950"
                        : "bg-rose-500 text-white"
                    }`}
                  >
                    {p.stock > 10 ? "In Stock" : p.stock > 0 ? "Low Stock" : "Out of Stock"}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">{p.brand}</span>
                      {p.weight && (
                        <span className="text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
                          {p.weight}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white line-clamp-1 group-hover:text-amber-500 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2">{p.description}</p>
                    <div className="text-[11px] font-mono font-semibold text-zinc-500">
                      Stock: <strong className="text-zinc-900 dark:text-white">{p.stock} units</strong>
                    </div>

                    {/* Weight Breakdown in Grid */}
                    {p.weightOptions && p.weightOptions.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {p.weightOptions.map((opt) => (
                          <span
                            key={opt.id}
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              (opt.stock ?? 0) > 10
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                : (opt.stock ?? 0) > 0
                                ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            {opt.weight}: <strong>{opt.stock ?? 0}</strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <div className="font-black text-lg text-zinc-900 dark:text-white">{formatCurrency(p.price)}</div>
                      <div className="text-[10px] text-zinc-400 line-through">{formatCurrency(p.mrp)}</div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-black transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* FULL ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-black/10 dark:border-white/10 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900">
              <div>
                <h2 className="text-xl font-black text-zinc-900 dark:text-white">
                  {editingProductId ? "Edit Product Details" : "Add New Grocery Product"}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Update images, category, price, MRP, stock, and descriptions.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Image URL Gallery */}
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Product Image URLs (HTTPS) *
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="url"
                    placeholder="Paste image link (e.g. https://images.unsplash.com/...)"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 flex items-center gap-1 flex-shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add URL
                  </button>
                </div>

                {/* Gallery Preview Badges */}
                <div className="flex flex-wrap gap-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                      <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove Image"
                      >
                        <X className="w-4 h-4 text-rose-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Title (English + Hindi) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Product Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Royal Aged Basmati Rice 5kg"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1 flex items-center gap-1.5">
                    <span>उत्पाद का नाम (Hindi Title)</span>
                    <span className="text-[10px] text-amber-500 font-normal">(वैकल्पिक / Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nameHi || ""}
                    onChange={(e) => setFormData({ ...formData, nameHi: e.target.value })}
                    placeholder="उदा. रॉयल बासमती चावल 5 किग्रा"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Tagline (English + Hindi) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Tagline / Subtitle (English)
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. Aged 2 Years • Extra Long Grain"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1 flex items-center gap-1.5">
                    <span>टैगलाइन (Hindi Tagline)</span>
                    <span className="text-[10px] text-amber-500 font-normal">(वैकल्पिक / Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.taglineHi || ""}
                    onChange={(e) => setFormData({ ...formData, taglineHi: e.target.value })}
                    placeholder="उदा. 2 वर्ष पुराना • लंबा दाना"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Category & Brand Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Supermarket Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white outline-none cursor-pointer"
                  >
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Brand Name *
                  </label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white outline-none cursor-pointer"
                  >
                    {allBrands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Unit of Measurement & Pack Size / Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <div>
                  <label className="text-xs font-bold text-zinc-900 dark:text-white block mb-1">
                    Stock Unit of Measurement (e.g. kg, L, Pack) *
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => {
                      const newUnit = e.target.value;
                      setFormData({
                        ...formData,
                        unit: newUnit,
                        weight: formData.weight ? formData.weight : `1 ${newUnit}`,
                      });
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white outline-none cursor-pointer font-bold"
                  >
                    {GROCERY_UNITS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 block">
                    Choose whether this grocery item is stocked in kilograms (kg), litres (L), grams, etc.
                  </span>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-900 dark:text-white block mb-1">
                    Pack Size / Net Weight (e.g. 5 kg, 2 L, 500 g) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="e.g. 5 kg, 1 L, 500 g, 1 Dozen Box"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-amber-500 font-bold"
                  />
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 block">
                    Shown on customer product cards, product details, cart, and checkout.
                  </span>
                </div>
              </div>

              {/* Dynamic Weight & Quantity Options Section (For Popup & Store) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
                  <div>
                    <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
                      <PackageCheck className="w-4 h-4 text-amber-500" />
                      Dynamic Weight / Pack Size Options
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Configure custom weights (e.g. 25g, 50g, 100g, 200g, 500g, 1kg) and prices shown directly in the customer popup.
                    </p>
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleApplyWeightPresets(STANDARD_GRAMS_PRESETS)}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-500 text-black text-[10px] font-extrabold hover:bg-amber-400 transition-colors shadow-sm flex items-center gap-1"
                      title="Add 25g, 50g, 100g, 200g, 500g, 1kg presets"
                    >
                      ⚡ Standard Grams (25g - 1kg)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyWeightPresets(LIQUID_VOLUME_PRESETS)}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-800 text-amber-400 border border-amber-500/30 text-[10px] font-bold hover:bg-zinc-700 transition-colors"
                      title="Add 100ml, 250ml, 500ml, 1L, 5L presets"
                    >
                      💧 Liquids / Litres
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyWeightPresets(BULK_STAPLE_PRESETS)}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-800 text-amber-400 border border-amber-500/30 text-[10px] font-bold hover:bg-zinc-700 transition-colors"
                      title="Add 1kg, 2kg, 5kg, 10kg, 25kg bulk presets"
                    >
                      🌾 Bulk Grains
                    </button>
                    {formData.weightOptions.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAllWeights}
                        className="px-2 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white text-[10px] font-bold transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                {/* Weight Options Rows */}
                {formData.weightOptions.length === 0 ? (
                  <div className="p-4 rounded-xl bg-white/60 dark:bg-zinc-800/60 border border-dashed border-amber-500/30 text-center space-y-2">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      No custom weight options configured for this product. Customers will buy at the single base weight ({formData.weight}).
                    </p>
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleApplyWeightPresets(STANDARD_GRAMS_PRESETS)}
                        className="text-xs font-bold text-amber-600 dark:text-amber-400 underline hover:text-amber-500"
                      >
                        Click here to apply standard 25g, 50g, 100g, 200g, 500g, 1kg options
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-zinc-500 uppercase px-2">
                      <div className="col-span-4 sm:col-span-4">Weight / Size Label *</div>
                      <div className="col-span-2 sm:col-span-2">Price (₹) *</div>
                      <div className="col-span-2 sm:col-span-2">MRP (₹)</div>
                      <div className="col-span-3 sm:col-span-3">Stock Units *</div>
                      <div className="col-span-1 sm:col-span-1 text-right">Action</div>
                    </div>
                    {formData.weightOptions.map((opt, idx) => (
                      <div
                        key={opt.id || idx}
                        className="grid grid-cols-12 gap-2 items-center bg-white dark:bg-zinc-800 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm"
                      >
                        <div className="col-span-4 sm:col-span-4">
                          <input
                            type="text"
                            required
                            placeholder="e.g. 500 grams (Half Kg)"
                            value={opt.weight}
                            onChange={(e) => handleUpdateWeightOption(idx, "weight", e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white font-bold outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="col-span-2 sm:col-span-2">
                          <input
                            type="number"
                            required
                            min={1}
                            placeholder="Price"
                            value={opt.price}
                            onChange={(e) => handleUpdateWeightOption(idx, "price", Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white font-bold outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="col-span-2 sm:col-span-2">
                          <input
                            type="number"
                            min={1}
                            placeholder="MRP"
                            value={opt.mrp || ""}
                            onChange={(e) => handleUpdateWeightOption(idx, "mrp", Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="col-span-3 sm:col-span-3">
                          <input
                            type="number"
                            required
                            min={0}
                            placeholder="Stock units"
                            value={opt.stock ?? 0}
                            onChange={(e) => handleUpdateWeightOption(idx, "stock", Math.max(0, Number(e.target.value)))}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/5 dark:bg-amber-500/10 text-xs text-amber-900 dark:text-amber-200 font-black outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="col-span-1 sm:col-span-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleRemoveWeightOption(idx)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title="Delete weight option"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Custom Weight Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleAddWeightOption}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border-2 border-dashed border-amber-500/40 text-xs font-bold text-amber-600 dark:text-amber-400 hover:border-amber-500 hover:bg-amber-500/10 transition-all flex items-center gap-1.5 w-full justify-center"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Another Weight Option
                  </button>
                </div>
              </div>

              {/* Pricing, MRP, GST & Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-amber-500 font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    MRP (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Stock Quantity ({formData.unit || "kg"}) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-amber-500 font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    GST Rate (%)
                  </label>
                  <input
                    type="number"
                    value={formData.gstPercentage}
                    onChange={(e) => setFormData({ ...formData, gstPercentage: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              {/* SKU & Dual Description (English + Hindi) */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white outline-none font-mono"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                      Product Description (English)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter description in English..."
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-amber-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1 flex items-center gap-1.5">
                      <span>उत्पाद का विवरण (Hindi Description)</span>
                      <span className="text-[10px] text-amber-500 font-normal">(वैकल्पिक / Optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={formData.descriptionHi || ""}
                      onChange={(e) => setFormData({ ...formData, descriptionHi: e.target.value })}
                      placeholder="हिंदी में विवरण दर्ज करें..."
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-amber-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Toggles & Badges */}
              <div className="flex flex-wrap items-center gap-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFlashSale}
                    onChange={(e) => setFormData({ ...formData, isFlashSale: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 accent-amber-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">🔥 Enable Flash Sale Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.has360View}
                    onChange={(e) => setFormData({ ...formData, has360View: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 accent-amber-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">🔄 Enable 360° Product View</span>
                </label>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
                >
                  {editingProductId ? "Save Changes" : "Publish Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
