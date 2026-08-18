// src/lib/constants/grocery.ts
// Centralised grocery‑related constants for the admin product page.

export const GROCERY_CATEGORIES = [
  "Atta, Rice & Organic Staples",
  "Organic Fruits & Vegetables",
  "Dairy, Eggs & Bakery",
  "Gourmet Spices & Cold-Pressed Oils",
  "Snacks & Organic Beverages",
];

export const GROCERY_BRANDS = [
  "Manoj Organics",
  "Gir Organic Dairy",
  "Himalayan Heritage",
  "Farm Direct",
  "Organic India",
];

export const GROCERY_UNITS = [
  { value: "kg", label: "kg (Kilograms) - Atta, Rice, Dal, Staples, Fruits" },
  { value: "g", label: "g (Grams) - Spices, Saffron, Dry Fruits, Herbs" },
  { value: "L", label: "L (Litres) - Oils, Ghee, Milk, Beverages" },
  { value: "ml", label: "ml (Millilitres) - Concentrates, Syrups" },
  { value: "Pack", label: "Pack - Sealed Pouches & Multipacks" },
  { value: "Pcs", label: "Pcs (Pieces) - Single Unit Groceries" },
  { value: "Box", label: "Box - Mango Boxes, Fruit Crates, Sweets" },
  { value: "Dozen", label: "Dozen (12 pcs) - Fruits, Eggs" },
  { value: "Units", label: "Units - General Inventory Count" },
];

export interface WeightPreset {
  label: string;
  weight: string;
  factor: number; // multiplier against base price (e.g. 1kg price)
}

// Standard Grams presets requested by user
export const STANDARD_GRAMS_PRESETS: WeightPreset[] = [
  { label: "25 grams", weight: "25 grams", factor: 0.1 },
  { label: "50 grams", weight: "50 grams", factor: 0.18 },
  { label: "100 grams", weight: "100 grams", factor: 0.32 },
  { label: "200 grams", weight: "200 grams", factor: 0.55 },
  { label: "500 grams (Half Kg)", weight: "500 grams (Half Kg)", factor: 0.85 },
  { label: "1 Kg", weight: "1 Kg", factor: 1.0 },
];

// Liquid Volume presets (Oils, Ghee, Syrups)
export const LIQUID_VOLUME_PRESETS: WeightPreset[] = [
  { label: "100 ml", weight: "100 ml", factor: 0.25 },
  { label: "250 ml", weight: "250 ml", factor: 0.45 },
  { label: "500 ml", weight: "500 ml", factor: 0.75 },
  { label: "1 Litre", weight: "1 Litre", factor: 1.0 },
  { label: "2 Litres", weight: "2 Litres", factor: 1.9 },
  { label: "5 Litres", weight: "5 Litres", factor: 4.5 },
];

// Bulk Staples presets (Atta, Rice, Pulses, Sugar)
export const BULK_STAPLE_PRESETS: WeightPreset[] = [
  { label: "1 Kg", weight: "1 Kg", factor: 1.0 },
  { label: "2 Kg", weight: "2 Kg", factor: 1.95 },
  { label: "5 Kg", weight: "5 Kg", factor: 4.6 },
  { label: "10 Kg", weight: "10 Kg", factor: 8.8 },
  { label: "25 Kg (Bag)", weight: "25 Kg (Bag)", factor: 21.0 },
];
