export type Role = "admin" | "customer";

export interface UserProfile {
  uid: string;
  clerkId: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: Role;
  phone?: string;
  walletBalance: number;
  rewardPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon?: string;
  featured?: boolean;
  itemCount: number;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  featured?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  color?: string;
  size?: string;
  unit?: string;
  price: number;
  mrp: number;
  stock: number;
  sku: string;
  image?: string;
}

export interface ProductWeightOption {
  id: string;
  weight: string; // e.g. "25 grams", "50 grams", "100 grams", "200 grams", "500 grams (Half Kg)", "1 Kg"
  price: number; // custom price for this weight
  mrp?: number; // optional custom MRP
  stock: number; // weight-specific stock units
  sku?: string;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface ProductQA {
  id: string;
  question: string;
  askedBy: string;
  answer?: string;
  answeredBy?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  features: string[];
  price: number;
  mrp: number;
  wholesalePrice: number;
  discountPercentage: number;
  gstPercentage: number;
  category: string;
  subCategory?: string;
  brand: string;
  sku: string;
  barcode: string;
  stock: number;
  unit?: string; // e.g. "kg", "g", "L", "ml", "Pack", "Pcs", "Box", "Dozen", "Units"
  inStock: boolean;
  weight: string; // e.g. "1.5 kg"
  weightOptions?: ProductWeightOption[]; // Dynamic weight/quantity options configured by admin
  dimensions: string; // e.g. "20x15x5 cm"
  images: string[];
  videoUrl?: string;
  model3DUrl?: string;
  has360View?: boolean;
  images360?: string[];
  variants?: ProductVariant[];
  specifications: ProductSpecification[];
  rating: number;
  reviewCount: number;
  tags: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  isFlashSale?: boolean;
  flashSaleEndsAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  selectedWeight?: ProductWeightOption;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
  type: "Home" | "Work" | "Other";
}

export type OrderStatus =
  | "Placed"
  | "Confirmed"
  | "Packed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancellation Requested"
  | "Cancelled"
  | "Returned"
  | "Refunded";

export interface RefundDetails {
  method: "UPI" | "Bank";
  upiId?: string;
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  cancellationReason?: string;
  requestedAt?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variantName?: string;
  selectedWeight?: string;
  selectedWeightId?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  tax: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: "Stripe" | "Razorpay" | "UPI" | "COD";
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded" | "Pending Verification";
  upiUtr?: string;
  cancellationReason?: string;
  refundDetails?: RefundDetails;
  status: OrderStatus;
  trackingNumber?: string;
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiresAt: string;
  usageCount: number;
  maxUsage: number;
  isActive: boolean;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected" | "Processed";
  refundAmount: number;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  subject: string;
  category: "Order" | "Payment" | "Product" | "Other";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High";
  createdAt: string;
  lastMessage: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  active: boolean;
}

export interface AnalyticsSummary {
  todayRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  conversionRate: number;
  avgOrderValue: number;
  revenueByMonth: { month: string; revenue: number; sales: number }[];
  salesByCategory: { name: string; value: number }[];
  inventoryStatus: { category: string; inStock: number; lowStock: number }[];
}
