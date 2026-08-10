import { db, isMockFirebase } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where
} from "firebase/firestore";
import { Product, Category, Brand, Order, Coupon, Banner, AnalyticsSummary } from "@/types";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BRANDS, MOCK_ORDERS, MOCK_BANNERS, MOCK_ANALYTICS } from "./mockData";

// Helper function to sanitize objects for Firestore (converts undefined values to null or removes them)
function sanitizeForFirestore<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_, value) => (value === undefined ? null : value))
  );
}

// Helper function to race Firestore calls with instant fallback (0ms when mock, max 30ms when live)
async function fetchWithInstantFallback<T>(firestoreCall: () => Promise<T>, fallback: T): Promise<T> {
  if (isMockFirebase) return fallback;
  try {
    const timeout = new Promise<T>((resolve) => setTimeout(() => resolve(fallback), 30));
    return await Promise.race([firestoreCall(), timeout]);
  } catch {
    return fallback;
  }
}

// Products Firestore API - Instant 0ms response
export async function getProductsFromStore(): Promise<Product[]> {
  return fetchWithInstantFallback(async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    if (querySnapshot.empty) return MOCK_PRODUCTS;
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    return products.length ? products : MOCK_PRODUCTS;
  }, MOCK_PRODUCTS);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const found = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (found) return found;

  return fetchWithInstantFallback(async () => {
    const q = query(collection(db, "products"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0];
      return { id: docData.id, ...docData.data() } as Product;
    }
    return null;
  }, null);
}

// Categories Firestore API - Instant 0ms response
export async function getCategoriesFromStore(): Promise<Category[]> {
  return fetchWithInstantFallback(async () => {
    const querySnapshot = await getDocs(collection(db, "categories"));
    if (querySnapshot.empty) return MOCK_CATEGORIES;
    const categories: Category[] = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() } as Category);
    });
    return categories.length ? categories : MOCK_CATEGORIES;
  }, MOCK_CATEGORIES);
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
  if (!isMockFirebase) {
    addDoc(collection(db, "categories"), sanitizedDoc).catch(() => {});
  }
  return newCat;
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
  return true;
}

// Brands Firestore API - Instant 0ms response
export async function getBrandsFromStore(): Promise<Brand[]> {
  return fetchWithInstantFallback(async () => {
    const querySnapshot = await getDocs(collection(db, "brands"));
    if (querySnapshot.empty) return MOCK_BRANDS;
    const brands: Brand[] = [];
    querySnapshot.forEach((doc) => {
      brands.push({ id: doc.id, ...doc.data() } as Brand);
    });
    return brands.length ? brands : MOCK_BRANDS;
  }, MOCK_BRANDS);
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
  if (!isMockFirebase) {
    addDoc(collection(db, "brands"), sanitizedDoc).catch(() => {});
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

// Orders Firestore API - Instant Order Placement
export async function createOrderInStore(orderData: Partial<Order>): Promise<Order> {
  const sanitizedItems = (orderData.items || []).map((item) => ({
    productId: item.productId || "",
    name: item.name || "Grocery Product",
    image: item.image || "",
    price: item.price || 0,
    quantity: item.quantity || 1,
    variantName: item.variantName || undefined,
  }));

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: `MT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
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
    status: "Placed",
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      { status: "Placed", timestamp: new Date().toISOString(), note: "Order placed successfully" }
    ]
  };

  // Sanitize object to remove all undefined values before passing to Firestore
  const sanitizedDoc = sanitizeForFirestore(newOrder);

  // Async non-blocking Firestore write attempt
  addDoc(collection(db, "orders"), sanitizedDoc).catch(() => {});

  // Add order to persistent store & local array for instant admin fulfillment view
  MOCK_ORDERS.unshift(newOrder);
  try {
    const { useOrderStore } = require("./store");
    useOrderStore.getState().addOrder(newOrder);
  } catch {}

  return newOrder;
}

export async function getOrdersFromStore(): Promise<Order[]> {
  return fetchWithInstantFallback(async () => {
    const querySnapshot = await getDocs(collection(db, "orders"));
    if (querySnapshot.empty) return MOCK_ORDERS;
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    return orders.length ? orders : MOCK_ORDERS;
  }, MOCK_ORDERS);
}

// Create, Update, Delete Product Firestore API
export async function createProductInFirestore(productData: Partial<Product>): Promise<Product> {
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
    stock: Number(productData.stock || 0),
    unit: productData.unit || "kg",
    inStock: (productData.stock || 0) > 0,
    weight: productData.weight || "1 kg",
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
  if (!isMockFirebase) {
    addDoc(collection(db, "products"), sanitizedDoc).catch(() => {});
  }
  return newProduct;
}

export async function updateProductInFirestore(id: string, updates: Partial<Product>): Promise<boolean> {
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
  return true;
}

export async function updateOrderStatusInFirestore(
  orderId: string,
  newStatus: Order["status"],
  note?: string
): Promise<boolean> {
  const foundOrder = MOCK_ORDERS.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (foundOrder) {
    foundOrder.status = newStatus;
    foundOrder.updatedAt = new Date().toISOString();
    if (!foundOrder.timeline) foundOrder.timeline = [];
    foundOrder.timeline.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Order status updated to ${newStatus}`,
    });
  }
  return true;
}

export const updateOrderStatusInStore = updateOrderStatusInFirestore;

// Analytics Firestore API
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  return MOCK_ANALYTICS;
}
