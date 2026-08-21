import { Language } from "./types";
import { Product } from "@/types";

const CATEGORY_TRANSLATIONS: Record<string, string> = {
  "Atta, Rice & Organic Staples": "आटा, चावल और जैविक अनाज",
  "Organic Fruits & Vegetables": "ताज़ा फल और जैविक सब्ज़ियां",
  "Dairy, Eggs & Bakery": "A2 डेयरी, घी और मक्खन",
  "Gourmet Spices & Cold-Pressed Oils": "शुद्ध मसाले और कच्ची घानी तेल",
  "Healthy Snacks & Dry Fruits": "मेवे (Dry Fruits) और स्नैक्स",
  "Beverages & Herbal Teas": "पेय पदार्थ और हर्बल चाय",
  "Personal Care & Natural Wellness": "प्राकृतिक स्वास्थ्य और पर्सनल केयर",
  "Household & Puja Essentials": "पूजा सामग्री और घरेलू सामान",
};

/**
 * Localizes weight strings like "100 grams", "1 kg", "500 grams (Half Kg)"
 */
export function formatLocalizedWeight(weightStr: string | undefined | null, lang: Language): string {
  if (!weightStr) return "";
  if (lang !== "hi") return weightStr;

  let result = weightStr;

  // Replace common patterns
  result = result
    .replace(/\b([0-9.]+)\s*(?:grams|gram|gms|gm|g)\b/gi, "$1 ग्राम")
    .replace(/\b([0-9.]+)\s*(?:kilograms|kilogram|kgs|kg)\b/gi, "$1 किग्रा")
    .replace(/\b([0-9.]+)\s*(?:litres|litre|liters|liter|ltr|l)\b/gi, "$1 लीटर")
    .replace(/\b([0-9.]+)\s*(?:millilitres|millilitre|milliliters|milliliter|ml)\b/gi, "$1 मि.ली.")
    .replace(/\b([0-9.]+)\s*(?:pieces|piece|pcs|pc)\b/gi, "$1 पीस")
    .replace(/\b([0-9.]+)\s*(?:dozen|doz)\b/gi, "$1 दर्जन")
    .replace(/\b([0-9.]+)\s*(?:pack|packs|pkt|pkts)\b/gi, "$1 पैकेट")
    .replace(/\(Half\s*Kg\)/gi, "(आधा किलो)")
    .replace(/\(Quarter\s*Kg\)/gi, "(पाव किलो)")
    .replace(/grams/gi, "ग्राम")
    .replace(/gram/gi, "ग्राम")
    .replace(/Kg/gi, "किग्रा");

  return result;
}

/**
 * Localizes order status
 */
export function formatLocalizedOrderStatus(status: string | undefined | null, lang: Language): string {
  if (!status) return "";
  if (lang !== "hi") {
    switch (status.toLowerCase()) {
      case "pending":
        return "Pending Verification";
      case "processing":
        return "Packing in Warehouse";
      case "shipped":
        return "Out for Delivery";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  }

  switch (status.toLowerCase()) {
    case "pending":
      return "सत्यापन लंबित";
    case "processing":
      return "वेयरहाउस में पैकिंग";
    case "shipped":
      return "डिलीवरी के लिए रवाना";
    case "delivered":
      return "सफलतापूर्वक डिलीवर";
    case "cancelled":
      return "ऑर्डर रद्द";
    default:
      return status;
  }
}

/**
 * Localizes category name
 */
export function formatLocalizedCategory(category: string | undefined | null, lang: Language): string {
  if (!category) return "";
  if (lang !== "hi") return category;
  return CATEGORY_TRANSLATIONS[category] || category;
}

/**
 * Returns localized product details
 */
export function getLocalizedProduct(
  product: Product | null | undefined,
  lang: Language
): {
  name: string;
  tagline: string;
  description: string;
  category: string;
  highlights: string[];
  features: string[];
} {
  if (!product) {
    return {
      name: "",
      tagline: "",
      description: "",
      category: "",
      highlights: [],
      features: [],
    };
  }

  if (lang === "hi") {
    return {
      name: product.nameHi || product.name || "",
      tagline: product.taglineHi || product.tagline || "",
      description: product.descriptionHi || product.description || "",
      category: formatLocalizedCategory(product.category, "hi"),
      highlights: product.highlightsHi && product.highlightsHi.length > 0 ? product.highlightsHi : product.highlights || [],
      features: product.featuresHi && product.featuresHi.length > 0 ? product.featuresHi : product.features || [],
    };
  }

  return {
    name: product.name || "",
    tagline: product.tagline || "",
    description: product.description || "",
    category: product.category || "",
    highlights: product.highlights || [],
    features: product.features || [],
  };
}
