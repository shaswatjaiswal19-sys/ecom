import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, Product, ProductVariant, Order, OrderStatus, Category, Brand } from "@/types";
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_CATEGORIES, MOCK_BRANDS } from "./mockData";

// SSR-Safe LocalStorage wrapper that prevents hydration crashes and ensures persistence
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(key, value);
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(key);
      } catch {}
    }
  },
};

interface CartState {
  cart: CartItem[];
  isCartOpen: boolean;
  couponCode: string | null;
  discountAmount: number;
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  toggleCartDrawer: (open?: boolean) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  getCartTotal: () => { subtotal: number; tax: number; total: number; itemCount: number };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,
      couponCode: null,
      discountAmount: 0,

      addToCart: (product, quantity = 1, variant) => {
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (item) =>
              item.product.id === product.id &&
              (variant ? item.selectedVariant?.id === variant.id : true)
          );

          if (existingIndex > -1) {
            const updated = [...state.cart];
            updated[existingIndex].quantity += quantity;
            return { cart: updated, isCartOpen: true };
          } else {
            return {
              cart: [...state.cart, { product, quantity, selectedVariant: variant }],
              isCartOpen: true,
            };
          }
        });
      },

      removeFromCart: (productId, variantId) => {
        set((state) => ({
          cart: state.cart.filter(
            (item) =>
              !(
                item.product.id === productId &&
                (variantId ? item.selectedVariant?.id === variantId : true)
              )
          ),
        }));
      },

      updateQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, variantId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) => {
            if (
              item.product.id === productId &&
              (variantId ? item.selectedVariant?.id === variantId : true)
            ) {
              return { ...item, quantity };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ cart: [], couponCode: null, discountAmount: 0 }),

      toggleCartDrawer: (open) =>
        set((state) => ({ isCartOpen: open !== undefined ? open : !state.isCartOpen })),

      applyCoupon: (code) => {
        const cleanCode = code.trim().toUpperCase();
        if (cleanCode === "MANOJ10" || cleanCode === "WELCOME10") {
          const subtotal = get().cart.reduce((sum, item) => {
            const price = item.selectedVariant?.price || item.product.price;
            return sum + price * item.quantity;
          }, 0);
          const discount = Math.round(subtotal * 0.1);
          set({ couponCode: cleanCode, discountAmount: discount });
          return { success: true, message: "10% Discount Coupon Applied Successfully!" };
        }
        if (cleanCode === "LUXURY500") {
          set({ couponCode: cleanCode, discountAmount: 500 });
          return { success: true, message: "₹500 Discount Coupon Applied Successfully!" };
        }
        return { success: false, message: "Invalid Coupon Code" };
      },

      removeCoupon: () => set({ couponCode: null, discountAmount: 0 }),

      getCartTotal: () => {
        const cart = get().cart;
        const subtotal = cart.reduce((sum, item) => {
          const price = item.selectedVariant?.price || item.product.price;
          return sum + price * item.quantity;
        }, 0);
        const discount = get().discountAmount;
        const netSubtotal = Math.max(0, subtotal - discount);
        const tax = Math.round(netSubtotal * 0.18); // 18% GST standard
        const total = netSubtotal + tax;
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

        return { subtotal, tax, total, itemCount };
      },
    }),
    {
      name: "manoj-traders-cart-storage",
      storage: createJSONStorage(() => safeLocalStorage),
    }
  )
);

// Wishlist Store
interface WishlistState {
  wishlist: Product[];
  isWishlistOpen: boolean;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlistDrawer: (open?: boolean) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      isWishlistOpen: false,
      toggleWishlist: (product) => {
        set((state) => {
          const exists = state.wishlist.some((p) => p.id === product.id);
          if (exists) {
            return { wishlist: state.wishlist.filter((p) => p.id !== product.id) };
          } else {
            return { wishlist: [...state.wishlist, product] };
          }
        });
      },
      isInWishlist: (productId) => get().wishlist.some((p) => p.id === productId),
      toggleWishlistDrawer: (open) =>
        set((state) => ({ isWishlistOpen: open !== undefined ? open : !state.isWishlistOpen })),
    }),
    {
      name: "manoj-traders-wishlist-storage",
      storage: createJSONStorage(() => safeLocalStorage),
    }
  )
);

// Compare Store
interface CompareState {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareState>((set) => ({
  compareItems: [],
  addToCompare: (product) =>
    set((state) => {
      if (state.compareItems.some((p) => p.id === product.id)) return state;
      if (state.compareItems.length >= 4) return state; // max 4
      return { compareItems: [...state.compareItems, product] };
    }),
  removeFromCompare: (productId) =>
    set((state) => ({
      compareItems: state.compareItems.filter((p) => p.id !== productId),
    })),
  clearCompare: () => set({ compareItems: [] }),
}));

// Persistent Products Store
interface ProductState {
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updatedProduct: Product) => void;
  deleteProduct: (id: string) => void;
  resetProducts: () => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: MOCK_PRODUCTS,
      setProducts: (products) => set({ products }),
      addProduct: (newProduct) => {
        // Also keep memory array updated
        const existingIdx = MOCK_PRODUCTS.findIndex((p) => p.id === newProduct.id);
        if (existingIdx === -1) {
          MOCK_PRODUCTS.unshift(newProduct);
        }
        set((state) => ({
          products: [newProduct, ...state.products.filter((p) => p.id !== newProduct.id)],
        }));
      },
      updateProduct: (id, updatedProduct) => {
        const idx = MOCK_PRODUCTS.findIndex((p) => p.id === id);
        if (idx > -1) {
          MOCK_PRODUCTS[idx] = updatedProduct;
        }
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
        }));
      },
      deleteProduct: (id) => {
        const idx = MOCK_PRODUCTS.findIndex((p) => p.id === id);
        if (idx > -1) {
          MOCK_PRODUCTS.splice(idx, 1);
        }
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },
      resetProducts: () => set({ products: MOCK_PRODUCTS }),
    }),
    {
      name: "shaswat-ecom-products-storage",
      storage: createJSONStorage(() => safeLocalStorage),
    }
  )
);

// Persistent Categories Store
interface CategoryState {
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updated: Category) => void;
  deleteCategory: (id: string) => void;
  resetCategories: () => void;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: MOCK_CATEGORIES,
      addCategory: (newCat) => {
        const existingIdx = MOCK_CATEGORIES.findIndex((c) => c.id === newCat.id);
        if (existingIdx === -1) {
          MOCK_CATEGORIES.unshift(newCat);
        } else {
          MOCK_CATEGORIES[existingIdx] = newCat;
        }
        set((state) => ({
          categories: [newCat, ...state.categories.filter((c) => c.id !== newCat.id)],
        }));
      },
      updateCategory: (id, updated) => {
        const idx = MOCK_CATEGORIES.findIndex((c) => c.id === id);
        if (idx > -1) {
          MOCK_CATEGORIES[idx] = updated;
        }
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? updated : c)),
        }));
      },
      deleteCategory: (id) => {
        const idx = MOCK_CATEGORIES.findIndex((c) => c.id === id);
        if (idx > -1) {
          MOCK_CATEGORIES.splice(idx, 1);
        }
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },
      resetCategories: () => set({ categories: MOCK_CATEGORIES }),
    }),
    {
      name: "shaswat-ecom-categories-storage",
      storage: createJSONStorage(() => safeLocalStorage),
    }
  )
);

// Persistent Brands Store
interface BrandState {
  brands: Brand[];
  addBrand: (brand: Brand) => void;
  deleteBrand: (id: string) => void;
  resetBrands: () => void;
}

export const useBrandStore = create<BrandState>()(
  persist(
    (set) => ({
      brands: MOCK_BRANDS,
      addBrand: (newBrand) => {
        const existingIdx = MOCK_BRANDS.findIndex((b) => b.id === newBrand.id);
        if (existingIdx === -1) {
          MOCK_BRANDS.unshift(newBrand);
        } else {
          MOCK_BRANDS[existingIdx] = newBrand;
        }
        set((state) => ({
          brands: [newBrand, ...state.brands.filter((b) => b.id !== newBrand.id)],
        }));
      },
      deleteBrand: (id) => {
        const idx = MOCK_BRANDS.findIndex((b) => b.id === id);
        if (idx > -1) {
          MOCK_BRANDS.splice(idx, 1);
        }
        set((state) => ({
          brands: state.brands.filter((b) => b.id !== id),
        }));
      },
      resetBrands: () => set({ brands: MOCK_BRANDS }),
    }),
    {
      name: "shaswat-ecom-brands-storage",
      storage: createJSONStorage(() => safeLocalStorage),
    }
  )
);

// Persistent Orders Store
interface OrderState {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  addOrder: (newOrder: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string, paymentStatus?: Order["paymentStatus"]) => void;
  requestCancellation: (orderId: string, reason: string, refundDetails: any) => void;
  resetOrders: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: MOCK_ORDERS,
      setOrders: (orders) => set({ orders }),
      addOrder: (newOrder) =>
        set((state) => {
          const filtered = state.orders.filter(
            (o) => o.id !== newOrder.id && o.orderNumber !== newOrder.orderNumber
          );
          return { orders: [newOrder, ...filtered] };
        }),
      updateOrderStatus: (orderId, newStatus, note, paymentStatus) =>
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id === orderId || o.orderNumber === orderId) {
              const updatedTimeline = [
                ...(o.timeline || []),
                {
                  status: newStatus,
                  timestamp: new Date().toISOString(),
                  note: note || `Status updated to ${newStatus}`,
                },
              ];
              return {
                ...o,
                status: newStatus,
                ...(paymentStatus ? { paymentStatus } : {}),
                updatedAt: new Date().toISOString(),
                timeline: updatedTimeline,
              };
            }
            return o;
          }),
        })),
      requestCancellation: (orderId, reason, refundDetails) =>
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id === orderId || o.orderNumber === orderId) {
              const updatedTimeline = [
                ...(o.timeline || []),
                {
                  status: "Cancellation Requested" as const,
                  timestamp: new Date().toISOString(),
                  note: `Cancellation requested by customer: ${reason}`,
                },
              ];
              return {
                ...o,
                status: "Cancellation Requested" as const,
                cancellationReason: reason,
                refundDetails,
                updatedAt: new Date().toISOString(),
                timeline: updatedTimeline,
              };
            }
            return o;
          }),
        })),
      resetOrders: () => set({ orders: MOCK_ORDERS }),
    }),
    {
      name: "shaswat-ecom-orders-storage",
      storage: createJSONStorage(() => safeLocalStorage),
    }
  )
);

// Persistent Shipping Store (Default: ₹0 Shipping Charge)
interface ShippingState {
  shippingFee: number;
  freeShippingThreshold: number;
  setShippingFee: (fee: number) => void;
  setFreeShippingThreshold: (threshold: number) => void;
}

export const useShippingStore = create<ShippingState>()(
  persist(
    (set) => ({
      shippingFee: 0,
      freeShippingThreshold: 0,
      setShippingFee: (fee) => set({ shippingFee: fee }),
      setFreeShippingThreshold: (threshold) => set({ freeShippingThreshold: threshold }),
    }),
    {
      name: "shaswat-ecom-shipping-storage",
      storage: createJSONStorage(() => safeLocalStorage),
    }
  )
);
