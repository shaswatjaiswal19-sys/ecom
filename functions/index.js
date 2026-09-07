const functions = require('firebase-functions/v1');
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

/**
 * 1. Cloud Function: Order Processing & Inventory Update
 * Triggers when a new order document is created in Firestore.
 */
exports.onOrderCreated = functions.firestore
  .document("orders/{orderId}")
  .onCreate(async (snap, context) => {
    const order = snap.data();
    const orderId = context.params.orderId;

    console.log(`[Cloud Function] Processing new order: ${orderId} (${order.orderNumber})`);

    const batch = db.batch();

    // Deduct stock for each item in the order
    for (const item of order.items) {
      if (item.productId) {
        const productRef = db.collection("products").doc(item.productId);
        const productDoc = await productRef.get();
        if (productDoc.exists) {
          const currentStock = productDoc.data().stock || 0;
          const newStock = Math.max(0, currentStock - item.quantity);
          batch.update(productRef, {
            stock: newStock,
            inStock: newStock > 0,
          });
        }
      }
    }

    // Award loyalty reward points to user (10 points per ₹1000 spent)
    if (order.userId && order.userId !== "usr-guest") {
      const userRef = db.collection("users").doc(order.userId);
      const earnedPoints = Math.floor(order.total / 100);
      batch.set(
        userRef,
        {
          rewardPoints: admin.firestore.FieldValue.increment(earnedPoints),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }

    await batch.commit();
    console.log(`[Cloud Function] Successfully processed inventory & rewards for order ${orderId}`);
  });

/**
 * 2. Cloud Function: Payment Verification Webhook Handler
 */
exports.verifyPaymentWebhook = functions.https.onRequest(async (req, res) => {
  try {
    const { orderId, paymentId, status } = req.body;
    if (!orderId) {
      return res.status(400).send({ error: "Missing orderId parameter" });
    }

    const orderRef = db.collection("orders").doc(orderId);
    await orderRef.update({
      paymentStatus: status === "success" ? "Paid" : "Failed",
      updatedAt: new Date().toISOString(),
    });

    res.status(200).send({ success: true, message: `Payment verified for order ${orderId}` });
  } catch (error) {
    console.error("Payment webhook error:", error);
    res.status(500).send({ error: error.message });
  }
});
