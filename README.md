# MANOJ TRADERS - Full Stack Production eCommerce Platform

> **"Quality Products. Trusted Service."**

A complete, production-ready, ultra-premium Full Stack eCommerce web application built for **Manoj Traders**. Inspired by Apple, Stripe, Linear, Vercel, and Shopify, maintaining a sleek luxury white theme with dynamic dark mode, 3D interactive hero canvas, 360° product inspection viewer, full Clerk authentication, and Cloud Firestore database integration.

---

## 🚀 Tech Stack

### Frontend & UI
- **Framework**: Next.js 15 (App Router) & React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Vanilla CSS Design Tokens
- **3D & Canvas**: Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **Animations**: Framer Motion & GSAP
- **State Management**: Zustand & TanStack Query (React Query)
- **Forms & Validation**: React Hook Form & Zod
- **Visualizations & Charts**: Recharts
- **PDF Generation**: `jspdf`
- **Notifications**: React Hot Toast
- **Icons**: Lucide Icons

### Backend & Cloud Infrastructure
- **Database**: Cloud Firestore (No SQL/Postgres/Prisma required!)
- **Storage**: Firebase Storage
- **Functions**: Firebase Cloud Functions (Order Processing, Stock Updates, Webhooks)
- **Authentication**: Clerk Auth (Email, Google, Passwordless, Role-Based Access Control)
- **Security**: Firestore Security Rules & Storage Rules

---

## 🌟 Key Application Features

### Storefront & Landing Page
1. **Interactive 3D Hero Experience**: Real-time floating product model rendered in React Three Fiber with mouse parallax, particle fields, and smooth camera controls.
2. **360° Product Inspection Viewer**: Interactive rotatable 3D product viewer.
3. **Flash Sales with Live Countdown**: Dynamic timer with real-time stock counters.
4. **Instant Search & Mega Menu**: Category discovery, quick filter, and search.
5. **Persistent Cart & Wishlist**: Zustand-powered shopping drawer with coupons and tax calculators.

### Customer Privileges & Account Portal (`/account`)
- **Dashboard Overview**: Active orders, wallet balance, and reward points.
- **Profile Management**: Personal info & Clerk multi-factor authentication.
- **Saved Address Book**: Multi-location shipping management (Home, Work, Other).
- **Wallet & Reward Points**: Redemptions, voucher codes, and cashback history.
- **Returns & Refunds**: 7-day doorstep pickup requests.
- **Support Portal**: Support tickets channel with priority response tracking.

### Admin Console (`/admin`)
- **Full Analytics Suite**: Recharts visualizations for Revenue, Category Sales, and Stock Velocity.
- **Product Catalog Management**: Add, edit, delete products with SKU, GST, MRP, stock levels.
- **Category & Brand Manager**: Organally group items and upload brand partner logos.
- **Order Fulfillment Dashboard**: Update timeline statuses (`Placed` -> `Confirmed` -> `Packed` -> `Shipped` -> `Out for Delivery` -> `Delivered`).
- **Coupons & Banners**: Promo code manager and hero slider controller.
- **System Settings**: Global tax rates, free shipping thresholds, and Firebase connection status.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js `18.x` or higher
- npm or pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/manojtraders/e-commerce.git
cd e-commerce

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Firebase & Clerk Setup

### Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=manoj-traders.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=manoj-traders
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=manoj-traders.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:...
```

---

## 📱 Progressive Web App (PWA)
Manoj Traders is fully PWA-enabled. Users on desktop, iOS, or Android can tap **"Install Manoj Traders App"** in the header or install banner for an app-like experience.
