"use client";

import { useEffect, ReactNode } from "react";
import { useProductStore } from "@/lib/store";
import { Product } from "@/types";

export default function DataSyncProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    async function syncProducts() {
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        if (json.success && Array.isArray(json.products) && json.products.length > 0) {
          const store = useProductStore.getState();
          const currentLocal = store.products;
          const mergedMap = new Map<string, Product>();

          // Server / Firestore products
          json.products.forEach((p: Product) => mergedMap.set(p.id, p));

          // Retain any locally created products from Admin Panel
          currentLocal.forEach((p: Product) => {
            if (!mergedMap.has(p.id)) {
              mergedMap.set(p.id, p);
            }
          });

          store.setProducts(Array.from(mergedMap.values()));
        }
      } catch (err) {
        console.warn("Products sync deferred, using local store:", err);
      }
    }

    syncProducts();
  }, []);

  return <>{children}</>;
}
