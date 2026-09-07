import { NextResponse } from "next/server";

// POST /api/webhooks/clerk - Process live Clerk authentication webhooks
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const eventType = payload?.type;

    if (!eventType) {
      return NextResponse.json({ success: false, error: "Invalid webhook event" }, { status: 400 });
    }

    const data = payload.data;

    switch (eventType) {
      case "user.created":
      case "user.updated": {
        const userId = data.id;
        const primaryEmail = data.email_addresses?.[0]?.email_address;
        const firstName = data.first_name || "";
        const lastName = data.last_name || "";
        const fullName = `${firstName} ${lastName}`.trim() || "Customer";

        console.log(`[Clerk Webhook] User synced: ${userId} (${fullName} - ${primaryEmail})`);
        break;
      }

      case "user.deleted": {
        const deletedUserId = data.id;
        console.log(`[Clerk Webhook] User removed: ${deletedUserId}`);
        break;
      }

      default:
        console.log(`[Clerk Webhook] Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ success: true, message: `Webhook ${eventType} processed` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Webhook processing failed" }, { status: 500 });
  }
}
