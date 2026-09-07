import { NextResponse } from "next/server";
import crypto from "crypto";

// POST /api/payment/razorpay - Create Razorpay payment order instance
export async function POST(request: Request) {
  try {
    const { amount, currency = "INR", receipt } = await request.json();

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: "Valid amount is required" }, { status: 400 });
    }

    // If keys are placeholder/missing, return instant mock payment instance
    if (!keyId || !keySecret || keyId.includes("YOUR_") || keyId.includes("123456")) {
      const mockOrder = {
        id: `order_mock_${Date.now()}`,
        entity: "order",
        amount: Math.round(amount * 100),
        amount_paid: 0,
        amount_due: Math.round(amount * 100),
        currency: currency.toUpperCase(),
        receipt: receipt || `rcpt_${Date.now()}`,
        status: "created",
        attempts: 0,
        notes: [],
        created_at: Math.floor(Date.now() / 1000),
        isMock: true,
      };
      return NextResponse.json({ success: true, order: mockOrder });
    }

    // Production Razorpay Order API call
    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // amount in paise
        currency: currency.toUpperCase(),
        receipt: receipt || `rcpt_${Date.now()}`,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ success: false, error: data.error?.description || "Razorpay API error" }, { status: response.status });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to create payment order" }, { status: 500 });
  }
}

// PUT /api/payment/razorpay - Verify Razorpay payment signature
export async function PUT(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret || keySecret.includes("YOUR_")) {
      // Mock mode: automatic verification success
      return NextResponse.json({ success: true, message: "Payment verified successfully (Mock Mode)" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      return NextResponse.json({ success: true, message: "Payment signature verified successfully" });
    } else {
      return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Payment verification failed" }, { status: 500 });
  }
}
