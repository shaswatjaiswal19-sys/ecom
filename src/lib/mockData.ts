import { Product, Category, Brand, Banner, AnalyticsSummary, Order } from "@/types";

export const MOCK_CATEGORIES: Category[] = [];

export const MOCK_BRANDS: Brand[] = [
  {
    id: "b-manoj-fresh",
    name: "Manoj Farms Organic",
    logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200",
    description: "Our signature line of pesticide-free farm fresh organic produce.",
    featured: true,
  },
  {
    id: "b-himalayan-pure",
    name: "Himalayan Naturals",
    logo: "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&q=80&w=200",
    description: "Pristine mountain-harvested grains, honey, and herbal teas.",
    featured: true,
  },
  {
    id: "b-royal-organics",
    name: "Royal Organics India",
    logo: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200",
    description: "Aged Royal Basmati and heritage single-origin spices.",
    featured: true,
  },
];

export const MOCK_PRODUCTS: Product[] = [];

export const MOCK_BANNERS: Banner[] = [
  {
    id: "b1",
    title: "100% Farm Fresh Organic Groceries Delivered in 24 Hours",
    subtitle: "Pesticide-Free Produce, A2 Gir Bilona Ghee & Royal Basmati Rice Direct to Your Doorstep",
    badge: "FARM TO TABLE FRESH",
    ctaText: "Shop Organic Supermarket",
    ctaLink: "/shop",
    imageUrl: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=1600",
    active: true,
  },
  {
    id: "b2",
    title: "Pure Cold-Pressed Oils & Heritage Kashmiri Spices",
    subtitle: "Traditional Kachi Ghani Wood-Pressed Oils & GI-Tagged Saffron",
    badge: "HEALTH & WELLNESS",
    ctaText: "Explore Gourmet Spices",
    ctaLink: "/shop?category=gourmet-spices-oils",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1600",
    active: true,
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "ord-8812",
    orderNumber: "MT-2026-8812",
    userId: "usr-1",
    customerName: "Priya Sharma",
    customerEmail: "priya.sharma@example.com",
    customerPhone: "+91 98200 11223",
    items: [
      {
        productId: "p1",
        name: "Manoj Royal 2-Year Aged Extra Long Basmati Rice (5kg)",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400",
        price: 999,
        quantity: 2,
      },
      {
        productId: "p5",
        name: "Manoj Farms Pure A2 Desi Gir Cow Bilona Ghee (1L)",
        image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&q=80&w=400",
        price: 1899,
        quantity: 1,
      },
    ],
    shippingAddress: {
      id: "addr-1",
      fullName: "Priya Sharma",
      phone: "+91 98200 11223",
      streetAddress: "Flat 402, Seawood Towers, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
      country: "India",
      isDefault: true,
      type: "Home",
    },
    billingAddress: {
      id: "addr-1",
      fullName: "Priya Sharma",
      phone: "+91 98200 11223",
      streetAddress: "Flat 402, Seawood Towers, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
      country: "India",
      isDefault: true,
      type: "Home",
    },
    subtotal: 3897,
    tax: 194,
    shippingFee: 0,
    discount: 300,
    total: 3791,
    paymentMethod: "Razorpay",
    paymentStatus: "Paid",
    status: "Delivered",
    trackingNumber: "EXP-IND-994812",
    estimatedDelivery: "2026-08-04",
    createdAt: "2026-08-01T14:30:00Z",
    updatedAt: "2026-08-04T11:00:00Z",
    timeline: [
      { status: "Placed", timestamp: "2026-08-01T14:30:00Z", note: "Order received successfully" },
      { status: "Confirmed", timestamp: "2026-08-01T15:00:00Z", note: "Fresh inventory reserved" },
      { status: "Packed", timestamp: "2026-08-02T09:00:00Z", note: "Moisture-proof packed" },
      { status: "Shipped", timestamp: "2026-08-02T16:00:00Z", note: "Handed over to Express Courier" },
      { status: "Delivered", timestamp: "2026-08-04T11:00:00Z", note: "Delivered to customer" },
    ],
  },
];

export const MOCK_ANALYTICS: AnalyticsSummary = {
  todayRevenue: 148500,
  monthlyRevenue: 4250000,
  yearlyRevenue: 48900000,
  totalOrders: 3240,
  totalCustomers: 8900,
  conversionRate: 4.8,
  avgOrderValue: 1312,
  revenueByMonth: [
    { month: "Jan", revenue: 3200000, sales: 2400 },
    { month: "Feb", revenue: 3600000, sales: 2750 },
    { month: "Mar", revenue: 3900000, sales: 2900 },
    { month: "Apr", revenue: 4100000, sales: 3100 },
    { month: "May", revenue: 4400000, sales: 3350 },
    { month: "Jun", revenue: 4600000, sales: 3500 },
    { month: "Jul", revenue: 4250000, sales: 3240 },
  ],
  salesByCategory: [
    { name: "Atta, Rice & Staples", value: 1850000 },
    { name: "Dairy, Eggs & Bakery", value: 1100000 },
    { name: "Cold-Pressed Oils & Spices", value: 850000 },
    { name: "Organic Fruits & Veg", value: 450000 },
  ],
  inventoryStatus: [
    { category: "Atta & Rice", inStock: 450, lowStock: 12 },
    { category: "Dairy & Ghee", inStock: 280, lowStock: 5 },
    { category: "Cold-Pressed Oils", inStock: 340, lowStock: 8 },
    { category: "Fresh Mangoes & Fruits", inStock: 90, lowStock: 25 },
  ],
};
