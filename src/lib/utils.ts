import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateDiscount(mrp: number, salePrice: number): number {
  if (!mrp || mrp <= salePrice) return 0;
  return Math.round(((mrp - salePrice) / mrp) * 100);
}
