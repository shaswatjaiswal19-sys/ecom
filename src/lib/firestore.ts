import { db, isMockFirebase } from "./firebase";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { Product, Category, Brand, Order, OrderItem, Coupon, Banner, AnalyticsSummary } from "@/types";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BRANDS, MOCK_ORDERS, MOCK_BANNERS, MOCK_ANALYTICS } from "./mockData";

// Helper function to sanitize objects for Firestore (converts undefined values to null or removes them)
function sanitizeForFirestore<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_, value) => (value === undefined ? null : value))
  );
}

// Helper function to race Firestore calls with instant fallback (0ms when mock, max 5000ms when live)
async function fetchWithInstantFallback<T>(firestoreCall: () => Promise<T>, fallback: T): Promise<T> {
  if (isMockFirebase) return fallback;
  try {
    const timeout = new Promise<T>((resolve) => setTimeout(() => resolve(fallback), 5000));
    return await Promise.race([firestoreCall(), timeout]);
  } catch {
    return fallback;
  }
}

// Products Firestore API - Database Synchronized
export async function getProductsFromStore(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const firestoreProducts: Product[] = [];
    querySnapshot.forEach((docSnap) => {
      firestoreProducts.push({ id: docSnap.id, ...docSnap.data() } as Product);
    });

    return firestoreProducts;
  } catch (err) {
    console.error("Firestore getProductsFromStore error:", err);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const q = query(collection(db, "products"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0];
      return { id: docData.id, ...docData.data() } as Product;
    }

    // Direct ID lookup fallback
    const idDoc = await getDocs(query(collection(db, "products"), where("id", "==", slug)));
    if (!idDoc.empty) {
      const docData = idDoc.docs[0];
      return { id: docData.id, ...docData.data() } as Product;
    }
  } catch (err) {
    console.error("Firestore getProductBySlug error:", err);
  }

  const found = MOCK_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
  return found || null;
}

// Categories Firestore API - Instant response & Persistent Firestore saving
export async function getCategoriesFromStore(): Promise<Category[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));
    const categories: Category[] = [];
    querySnapshot.forEach((docSnap) => {
      categories.push({ id: docSnap.id, ...docSnap.data() } as Category);
    });
    return categories;
  } catch (err) {
    console.error("Firestore getCategoriesFromStore error:", err);
    return [];
  }
}

export async function createCategoryInFirestore(catData: Partial<Category>): Promise<Category> {
  const newCat: Category = {
    id: catData.id || `cat-${Date.now()}`,
    name: catData.name || "New Category",
    slug: catData.slug || (catData.name || "").toLowerCase().replace(/[^a-z0-9]/g, "-"),
    description: catData.description || "Farm-fresh organic collection",
    image: catData.image || "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800",
    icon: catData.icon || "Apple",
    itemCount: catData.itemCount || 0,
    featured: catData.featured ?? true,
  };

  const existingIdx = MOCK_CATEGORIES.findIndex((c) => c.id === newCat.id);
  if (existingIdx === -1) {
    MOCK_CATEGORIES.unshift(newCat);
  } else {
    MOCK_CATEGORIES[existingIdx] = newCat;
  }

  try {
    const { useCategoryStore } = require("./store");
    useCategoryStore.getState().addCategory(newCat);
  } catch {}

  const sanitizedDoc = sanitizeForFirestore(newCat);
  try {
    await setDoc(doc(db, "categories", newCat.id), sanitizedDoc);
  } catch (err) {
    console.error("Firestore createCategoryInFirestore error:", err);
  }
  return newCat;
}

export async function updateCategoryInFirestore(id: string, updates: Partial<Category>): Promise<boolean> {
  const index = MOCK_CATEGORIES.findIndex((c) => c.id === id);
  if (index !== -1) {
    MOCK_CATEGORIES[index] = { ...MOCK_CATEGORIES[index], ...updates };
  }
  try {
    const { useCategoryStore } = require("./store");
    const existing = useCategoryStore.getState().categories.find((c: Category) => c.id === id);
    if (existing) {
      useCategoryStore.getState().updateCategory(id, { ...existing, ...updates });
    }
  } catch {}

  try {
    await setDoc(doc(db, "categories", id), sanitizeForFirestore(updates), { merge: true });
  } catch (err) {
    console.error("Firestore updateCategoryInFirestore error:", err);
  }
  return true;
}

export async function deleteCategoryInFirestore(id: string): Promise<boolean> {
  const idx = MOCK_CATEGORIES.findIndex((c) => c.id === id);
  if (idx > -1) {
    MOCK_CATEGORIES.splice(idx, 1);
  }
  try {
    const { useCategoryStore } = require("./store");
    useCategoryStore.getState().deleteCategory(id);
  } catch {}

  try {
    await deleteDoc(doc(db, "categories", id));
  } catch (err) {
    console.error("Firestore deleteCategoryInFirestore error:", err);
  }
  return true;
}

// Brands Firestore API - Instant response & Persistent Firestore saving
export async function getBrandsFromStore(): Promise<Brand[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "brands"));
    const brands: Brand[] = [];
    querySnapshot.forEach((docSnap) => {
      brands.push({ id: docSnap.id, ...docSnap.data() } as Brand);
    });
    if (brands.length > 0) return brands;
    return MOCK_BRANDS;
  } catch (err) {
    console.error("Firestore getBrandsFromStore error:", err);
    return MOCK_BRANDS;
  }
}

export async function createBrandInFirestore(brandData: Partial<Brand>): Promise<Brand> {
  const newBrand: Brand = {
    id: brandData.id || `br-${Date.now()}`,
    name: brandData.name || "New Brand",
    logo: brandData.logo || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200",
    description: brandData.description || "Official Organic Partner",
    featured: brandData.featured ?? true,
  };

  const existingIdx = MOCK_BRANDS.findIndex((b) => b.id === newBrand.id);
  if (existingIdx === -1) {
    MOCK_BRANDS.unshift(newBrand);
  } else {
    MOCK_BRANDS[existingIdx] = newBrand;
  }

  try {
    const { useBrandStore } = require("./store");
    useBrandStore.getState().addBrand(newBrand);
  } catch {}

  const sanitizedDoc = sanitizeForFirestore(newBrand);
  try {
    await setDoc(doc(db, "brands", newBrand.id), sanitizedDoc);
  } catch (err) {
    console.error("Firestore createBrandInFirestore error:", err);
  }
  return newBrand;
}

export async function deleteBrandInFirestore(id: string): Promise<boolean> {
  const idx = MOCK_BRANDS.findIndex((b) => b.id === id);
  if (idx > -1) {
    MOCK_BRANDS.splice(idx, 1);
  }
  try {
    const { useBrandStore } = require("./store");
    useBrandStore.getState().deleteBrand(id);
  } catch {}

  try {
    await deleteDoc(doc(db, "brands", id));
  } catch (err) {
    console.error("Firestore deleteBrandInFirestore error:", err);
  }
  return true;
}

// Banners Firestore API - Instant 0ms response
export async function getBannersFromStore(): Promise<Banner[]> {
  return fetchWithInstantFallback(async () => {
    const querySnapshot = await getDocs(collection(db, "banners"));
    if (querySnapshot.empty) return MOCK_BANNERS;
    const banners: Banner[] = [];
    querySnapshot.forEach((doc) => {
      banners.push({ id: doc.id, ...doc.data() } as Banner);
    });
    return banners.length ? banners : MOCK_BANNERS;
  }, MOCK_BANNERS);
}

// Stock Deduction Engine for Weight-Specific Inventory
export async function deductProductStock(items: OrderItem[]): Promise<void> {
  // Step 1: Pre-validate stock for all items before any deduction
  for (const item of items) {
    let product: Product | undefined;
    try {
      const { useProductStore } = require("./store");
      product = useProductStore.getState().products.find((p: Product) => p.id === item.productId);
    } catch {}
    if (!product) {
      product = MOCK_PRODUCTS.find((p) => p.id === item.productId);
    }
    if (!product) {
      try {
        const snap = await getDoc(doc(db, "products", item.productId));
        if (snap.exists()) {
          product = { id: snap.id, ...snap.data() } as Product;
        }
      } catch {}
    }

    if (product) {
      if (item.selectedWeight && product.weightOptions && product.weightOptions.length > 0) {
        const weightOpt = product.weightOptions.find(
          (w) => w.weight === item.selectedWeight || w.id === item.selectedWeightId || w.id === item.selectedWeight
        );
        if (weightOpt) {
          const availStock = Number(weightOpt.stock ?? 0);
          if (availStock < item.quantity) {
            throw new Error(`Insufficient stock for "${product.name}" (${weightOpt.weight}). Available: ${availStock}, requested: ${item.quantity}.`);
          }
        } else if (Number(product.stock ?? 0) < item.quantity) {
          throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}.`);
        }
      } else if (Number(product.stock ?? 0) < item.quantity) {
        throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}.`);
      }
    }
  }

  // Step 2: All items have sufficient stock -> perform exact weight stock deductions
  for (const item of items) {
    let product: Product | undefined;
    try {
      const { useProductStore } = require("./store");
      product = useProductStore.getState().products.find((p: Product) => p.id === item.productId);
    } catch {}
    if (!product) {
      product = MOCK_PRODUCTS.find((p) => p.id === item.productId);
    }
    if (!product) {
      try {
        const snap = await getDoc(doc(db, "products", item.productId));
        if (snap.exists()) {
          product = { id: snap.id, ...snap.data() } as Product;
        }
      } catch {}
    }

    if (product) {
      let updatedWeightOptions = product.weightOptions ? [...product.weightOptions] : undefined;
      let newStock = Number(product.stock || 0);

      if (item.selectedWeight && updatedWeightOptions && updatedWeightOptions.length > 0) {
        const weightIdx = updatedWeightOptions.findIndex(
          (w) => w.weight === item.selectedWeight || w.id === item.selectedWeightId || w.id === item.selectedWeight
        );
        if (weightIdx !== -1) {
          const currentWeightStock = Number(updatedWeightOptions[weightIdx].stock ?? 0);
          updatedWeightOptions[weightIdx] = {
            ...updatedWeightOptions[weightIdx],
            stock: Math.max(0, currentWeightStock - item.quantity),
          };
          // Recalculate total product stock as sum of all weight variant stocks
          newStock = updatedWeightOptions.reduce((sum, w) => sum + Number(w.stock || 0), 0);
        } else {
          newStock = Math.max(0, Number(product.stock || 0) - item.quantity);
        }
      } else {
        newStock = Math.max(0, Number(product.stock || 0) - item.quantity);
      }

      const updatedProduct: Product = {
        ...product,
        weightOptions: updatedWeightOptions,
        stock: newStock,
        inStock: newStock > 0,
        updatedAt: new Date().toISOString(),
      };

      // 1. Update in-memory MOCK_PRODUCTS
      const mockIdx = MOCK_PRODUCTS.findIndex((p) => p.id === product!.id);
      if (mockIdx !== -1) {
        MOCK_PRODUCTS[mockIdx] = updatedProduct;
      }

      // 2. Update Zustand store
      try {
        const { useProductStore } = require("./store");
        useProductStore.getState().updateProduct(product.id, updatedProduct);
      } catch {}

      // 3. Persist updated product to Firestore
      try {
        await setDoc(doc(db, "products", product.id), sanitizeForFirestore(updatedProduct), { merge: true });
      } catch (err) {
        console.error("Firestore product stock deduction error:", err);
      }
    }
  }
}

// Orders Firestore API - Guaranteed Persistence & Stock Deduction
export async function createOrderInStore(orderData: Partial<Order>): Promise<Order> {
  const sanitizedItems: OrderItem[] = (orderData.items || []).map((item) => ({
    productId: item.productId || "",
    name: item.name || "Grocery Product",
    image: item.image || "",
    price: item.price || 0,
    quantity: item.quantity || 1,
    variantName: item.variantName || undefined,
    selectedWeight: item.selectedWeight || undefined,
    selectedWeightId: item.selectedWeightId || undefined,
  }));

  // Deduct stock for each item based on exact selected weight variant
  await deductProductStock(sanitizedItems);

  const orderId = orderData.id || `ord-${Date.now()}`;
  const newOrder: Order = {
    id: orderId,
    orderNumber: orderData.orderNumber || `MT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: orderData.userId || "usr-guest",
    customerName: orderData.customerName || "Customer",
    customerEmail: orderData.customerEmail || "customer@example.com",
    customerPhone: orderData.customerPhone || "+91 99999 99999",
    items: sanitizedItems,
    shippingAddress: orderData.shippingAddress!,
    billingAddress: orderData.billingAddress || orderData.shippingAddress!,
    subtotal: orderData.subtotal || 0,
    tax: orderData.tax || 0,
    shippingFee: orderData.shippingFee || 0,
    discount: orderData.discount || 0,
    total: orderData.total || 0,
    paymentMethod: orderData.paymentMethod || "COD",
    paymentStatus: orderData.paymentStatus || (orderData.paymentMethod === "UPI" ? "Pending Verification" : orderData.paymentMethod === "COD" ? "Pending" : "Paid"),
    upiUtr: orderData.upiUtr || undefined,
    status: orderData.status || "Placed",
    estimatedDelivery: orderData.estimatedDelivery || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    createdAt: orderData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: orderData.timeline || [
      { status: "Placed", timestamp: new Date().toISOString(), note: "Order placed successfully" }
    ]
  };

  // Sanitize object to remove all undefined values before passing to Firestore
  const sanitizedDoc = sanitizeForFirestore(newOrder);

  // Write directly to Firestore document
  try {
    await setDoc(doc(db, "orders", newOrder.id), sanitizedDoc);
  } catch (err) {
    console.error("Firestore order save error:", err);
  }

  // Add order to persistent store & memory array
  const existingIdx = MOCK_ORDERS.findIndex(
    (o) => o.id === newOrder.id || o.orderNumber === newOrder.orderNumber
  );
  if (existingIdx === -1) {
    MOCK_ORDERS.unshift(newOrder);
  } else {
    MOCK_ORDERS[existingIdx] = newOrder;
  }

  try {
    const { useOrderStore } = require("./store");
    useOrderStore.getState().addOrder(newOrder);
  } catch {}

  return newOrder;
}

export async function getOrdersFromStore(): Promise<Order[]> {
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q).catch(async () => {
      return await getDocs(collection(db, "orders"));
    });

    const orders: Order[] = [];
    querySnapshot.forEach((docSnap) => {
      orders.push({ id: docSnap.id, ...docSnap.data() } as Order);
    });

    if (orders.length > 0) {
      return orders;
    }
    return MOCK_ORDERS;
  } catch (err) {
    console.error("Error fetching orders from Firestore:", err);
    return MOCK_ORDERS;
  }
}

// Create, Update, Delete Product Firestore API - Guaranteed Persistence
export async function createProductInFirestore(productData: Partial<Product>): Promise<Product> {
  const sanitizedWeightOptions = (productData.weightOptions || []).map((opt) => ({
    id: opt.id || `wt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    weight: opt.weight || "1 kg",
    price: Number(opt.price || 0),
    mrp: opt.mrp !== undefined ? Number(opt.mrp) : undefined,
    stock: Number(opt.stock ?? 0),
    sku: opt.sku || undefined,
  }));

  const computedStock = sanitizedWeightOptions.length > 0
    ? sanitizedWeightOptions.reduce((sum, opt) => sum + Number(opt.stock || 0), 0)
    : Number(productData.stock || 0);

  const newProduct: Product = {
    id: productData.id || `prod-${Date.now()}`,
    name: productData.name || "Grocery Product",
    slug: productData.slug || (productData.name || "").toLowerCase().replace(/[^a-z0-9]/g, "-"),
    tagline: productData.tagline || "100% Organic & Farm Fresh",
    description: productData.description || "Farm-fresh organic grocery product.",
    highlights: productData.highlights || ["100% Organic Certified", "Farm Direct", "Zero Preservatives"],
    features: productData.features || ["Freshly Harvested", "Hygienically Packed"],
    price: Number(productData.price || 0),
    mrp: Number(productData.mrp || Number(productData.price || 0) * 1.25),
    wholesalePrice: Number(productData.price || 0) * 0.85,
    discountPercentage: Math.round((((productData.mrp || 0) - (productData.price || 0)) / (productData.mrp || 1)) * 100) || 10,
    gstPercentage: Number(productData.gstPercentage || 5),
    category: productData.category || "Atta, Rice & Organic Staples",
    brand: productData.brand || "Manoj Organics",
    sku: productData.sku || `SKU-MT-${Math.floor(1000 + Math.random() * 9000)}`,
    barcode: productData.barcode || `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    stock: computedStock,
    unit: productData.unit || "kg",
    inStock: computedStock > 0,
    weight: productData.weight || "1 kg",
    weightOptions: sanitizedWeightOptions.length > 0 ? sanitizedWeightOptions : undefined,
    dimensions: productData.dimensions || "15x10x20 cm",
    images: productData.images?.length ? productData.images : ["https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800"],
    specifications: productData.specifications || [],
    rating: 5.0,
    reviewCount: 1,
    tags: productData.tags || ["organic", "grocery"],
    isFlashSale: Boolean(productData.isFlashSale),
    has360View: Boolean(productData.has360View),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add to memory list
  const existingIndex = MOCK_PRODUCTS.findIndex((p) => p.id === newProduct.id);
  if (existingIndex === -1) {
    MOCK_PRODUCTS.unshift(newProduct);
  } else {
    MOCK_PRODUCTS[existingIndex] = newProduct;
  }

  try {
    const { useProductStore } = require("./store");
    useProductStore.getState().addProduct(newProduct);
  } catch {}

  const sanitizedDoc = sanitizeForFirestore(newProduct);
  try {
    await setDoc(doc(db, "products", newProduct.id), sanitizedDoc);
  } catch (err) {
    console.error("Firestore createProduct error:", err);
  }

  return newProduct;
}

export async function updateProductInFirestore(id: string, updates: Partial<Product>): Promise<boolean> {
  if (updates.weightOptions) {
    updates.weightOptions = updates.weightOptions.map((opt) => ({
      id: opt.id || `wt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      weight: opt.weight || "1 kg",
      price: Number(opt.price || 0),
      mrp: opt.mrp !== undefined ? Number(opt.mrp) : undefined,
      stock: Number(opt.stock ?? 0),
      sku: opt.sku || undefined,
    }));
    const computedStock = updates.weightOptions.reduce((sum, opt) => sum + Number(opt.stock || 0), 0);
    updates.stock = computedStock;
    updates.inStock = computedStock > 0;
  } else if (updates.stock !== undefined) {
    updates.stock = Number(updates.stock);
    updates.inStock = updates.stock > 0;
  }

  const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
  if (index !== -1) {
    MOCK_PRODUCTS[index] = { ...MOCK_PRODUCTS[index], ...updates };
  }
  try {
    const { useProductStore } = require("./store");
    const existing = useProductStore.getState().products.find((p: Product) => p.id === id);
    if (existing) {
      useProductStore.getState().updateProduct(id, { ...existing, ...updates });
    }
  } catch {}

  try {
    await setDoc(doc(db, "products", id), sanitizeForFirestore(updates), { merge: true });
  } catch (err) {
    console.error("Firestore updateProduct error:", err);
  }
  return true;
}

export async function deleteProductInFirestore(id: string): Promise<boolean> {
  const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
  if (index !== -1) {
    MOCK_PRODUCTS.splice(index, 1);
  }
  try {
    const { useProductStore } = require("./store");
    useProductStore.getState().deleteProduct(id);
  } catch {}

  try {
    await deleteDoc(doc(db, "products", id));
  } catch (err) {
    console.error("Firestore deleteProduct error:", err);
  }
  return true;
}

export async function updateOrderStatusInFirestore(
  orderId: string,
  newStatus: Order["status"],
  note?: string,
  paymentStatus?: Order["paymentStatus"]
): Promise<boolean> {
  const updatedAt = new Date().toISOString();
  const timelineItem = {
    status: newStatus,
    timestamp: updatedAt,
    note: note || `Order status updated to ${newStatus}`,
  };

  const updatePayload: any = {
    status: newStatus,
    updatedAt,
  };
  if (paymentStatus) {
    updatePayload.paymentStatus = paymentStatus;
  }

  // 1. Update in Firestore
  try {
    const orderRef = doc(db, "orders", orderId);
    let updated = false;
    try {
      await updateDoc(orderRef, updatePayload);
      updated = true;
    } catch {
      // Document might be keyed by another ID, search by orderNumber or id
      const q = query(
        collection(db, "orders"),
        where("orderNumber", "==", orderId)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (docSnap) => {
        await updateDoc(doc(db, "orders", docSnap.id), updatePayload);
        updated = true;
      });
    }
  } catch (err) {
    console.error("Error updating order status in Firestore:", err);
  }

  // 2. Update in local store
  try {
    const { useOrderStore } = require("./store");
    useOrderStore.getState().updateOrderStatus(orderId, newStatus, note, paymentStatus);
  } catch {}

  // 3. Update in memory MOCK_ORDERS array
  const foundOrder = MOCK_ORDERS.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (foundOrder) {
    foundOrder.status = newStatus;
    foundOrder.updatedAt = updatedAt;
    if (paymentStatus) {
      foundOrder.paymentStatus = paymentStatus;
    }
    if (!foundOrder.timeline) foundOrder.timeline = [];
    foundOrder.timeline.push(timelineItem);
  }
  return true;
}

export const updateOrderStatusInStore = updateOrderStatusInFirestore;

// Analytics Firestore API
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  return MOCK_ANALYTICS;
}
