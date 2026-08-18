import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, Product, ProductVariant, ProductWeightOption, Order, OrderStatus, Category, Brand } from "@/types";
import { MOCK_ORDERS, MOCK_BRANDS } from "./mockData";

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
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant, weight?: ProductWeightOption) => void;
  removeFromCart: (productId: string, variantId?: string, weightId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string, weightId?: string) => void;
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

      addToCart: (product, quantity = 1, variant, weight) => {
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (item) =>
              item.product.id === product.id &&
              (variant ? item.selectedVariant?.id === variant.id : !item.selectedVariant) &&
              (weight ? (item.selectedWeight?.id === weight.id || item.selectedWeight?.weight === weight.weight) : !item.selectedWeight)
          );

          if (existingIndex > -1) {
            const updated = [...state.cart];
            updated[existingIndex].quantity += quantity;
            return { cart: updated, isCartOpen: true };
          } else {
            return {
              cart: [...state.cart, { product, quantity, selectedVariant: variant, selectedWeight: weight }],
              isCartOpen: true,
            };
          }
        });
      },

      removeFromCart: (productId, variantId, weightId) => {
        set((state) => ({
          cart: state.cart.filter(
            (item) =>
              !(
                item.product.id === productId &&
                (variantId ? item.selectedVariant?.id === variantId : true) &&
                (weightId ? (item.selectedWeight?.id === weightId || item.selectedWeight?.weight === weightId) : true)
              )
          ),
        }));
      },

      updateQuantity: (productId, quantity, variantId, weightId) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, variantId, weightId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) => {
            if (
              item.product.id === productId &&
              (variantId ? item.selectedVariant?.id === variantId : true) &&
              (weightId ? (item.selectedWeight?.id === weightId || item.selectedWeight?.weight === weightId) : true)
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
            const price = item.selectedWeight?.price || item.selectedVariant?.price || item.product.price;
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
          const price = item.selectedWeight?.price || item.selectedVariant?.price || item.product.price;
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
      name: "manoj-traders-cart-storage-v2",
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

const DEFAULT_MOCK_IDS = new Set(["p1", "p2", "p3", "p4", "p5", "p6"]);

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: [],
      setProducts: (products) =>
        set({
          products: (products || []).filter((p) => !DEFAULT_MOCK_IDS.has(p.id)),
        }),
      addProduct: (newProduct) => {
        if (DEFAULT_MOCK_IDS.has(newProduct.id)) return;
        set((state) => ({
          products: [newProduct, ...state.products.filter((p) => p.id !== newProduct.id)],
        }));
      },
      updateProduct: (id, updatedProduct) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
        }));
      },
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },
      resetProducts: () => set({ products: [] }),
    }),
    {
      name: "manoj-traders-products-v3",
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({
        products: state.products.filter((p) => !DEFAULT_MOCK_IDS.has(p.id)),
      }),
    }
  )
);

// Persistent Categories Store
interface CategoryState {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updated: Category) => void;
  deleteCategory: (id: string) => void;
  resetCategories: () => void;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: [],
      setCategories: (categories) =>
        set({
          categories: Array.isArray(categories) ? categories : [],
        }),
      addCategory: (newCat) => {
        set((state) => ({
          categories: [newCat, ...state.categories.filter((c) => c.id !== newCat.id)],
        }));
      },
      updateCategory: (id, updated) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? updated : c)),
        }));
      },
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },
      resetCategories: () => set({ categories: [] }),
    }),
    {
      name: "manoj-traders-categories-v3",
      storage: createJSONStorage(() => safeLocalStorage),
    }
  )
);

// Persistent Brands Store
interface BrandState {
  brands: Brand[];
  setBrands: (brands: Brand[]) => void;
  addBrand: (brand: Brand) => void;
  updateBrand: (id: string, updated: Brand) => void;
  deleteBrand: (id: string) => void;
  resetBrands: () => void;
}

export const useBrandStore = create<BrandState>()(
  persist(
    (set) => ({
      brands: MOCK_BRANDS,
      setBrands: (brands) =>
        set({
          brands: Array.isArray(brands) && brands.length > 0 ? brands : MOCK_BRANDS,
        }),
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
      updateBrand: (id, updated) => {
        set((state) => ({
          brands: state.brands.map((b) => (b.id === id ? updated : b)),
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
