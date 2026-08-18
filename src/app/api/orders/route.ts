import { NextResponse } from "next/server";
import { getOrdersFromStore, createOrderInStore, updateOrderStatusInStore } from "@/lib/firestore";
import { requireServerAdmin } from "@/lib/serverAuth";

// GET /api/orders - Retrieve list of orders (Filtered by userId or orderId)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const orderId = searchParams.get("orderId");

    let orders = await getOrdersFromStore();

    if (orderId) {
      const single = orders.find(
        (o) => o.id === orderId || o.orderNumber.toLowerCase() === orderId.toLowerCase()
      );
      if (!single) {
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, order: single });
    }

    if (userId) {
      orders = orders.filter((o) => o.userId === userId);
    }

    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch orders" }, { status: 500 });
  }
}

// POST /api/orders - Place a new order (Authenticated customers)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.items || !body.items.length || !body.shippingAddress) {
      return NextResponse.json(
        { success: false, error: "Order items and shipping address are required" },
        { status: 400 }
      );
    }

    const createdOrder = await createOrderInStore(body);
    return NextResponse.json(
      { success: true, message: "Order placed successfully", order: createdOrder },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to place order" }, { status: 400 });
  }
}

// PATCH /api/orders - Update order fulfillment status (Admin Only)
export async function PATCH(request: Request) {
  try {
    const authGuard = await requireServerAdmin();
    if (!authGuard.authorized) {
      return authGuard.response!;
    }

    const body = await request.json();
    const { orderId, status, note, paymentStatus } = body;

    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: "Order ID and status are required" }, { status: 400 });
    }

    await updateOrderStatusInStore(orderId, status, note, paymentStatus);
    return NextResponse.json({ success: true, message: `Order status updated to ${status}` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to update order status" }, { status: 500 });
  }
}
