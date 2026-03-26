import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/security";
import { appendPaymentEvent, markPaymentOrderFailed, markPaymentOrderPaid } from "@/lib/store";

export const runtime = "nodejs";

type RazorpayWebhookEvent = {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        error_description?: string;
      };
    };
    order?: {
      entity?: {
        id?: string;
      };
    };
  };
};

function getOrderId(event: RazorpayWebhookEvent) {
  return (
    event.payload?.payment?.entity?.order_id ??
    event.payload?.order?.entity?.id ??
    undefined
  );
}

export async function POST(request: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { message: "Webhook secret is not configured." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json({ message: "Missing webhook signature." }, { status: 400 });
  }

  const rawBody = await request.text();
  const valid = verifyWebhookSignature({
    rawBody,
    signature,
    secret,
  });
  if (!valid) {
    return NextResponse.json({ message: "Invalid webhook signature." }, { status: 400 });
  }

  let event: RazorpayWebhookEvent;
  try {
    event = JSON.parse(rawBody) as RazorpayWebhookEvent;
  } catch {
    return NextResponse.json({ message: "Invalid webhook payload." }, { status: 400 });
  }
  const eventType = event.event ?? "unknown";
  const razorpayOrderId = getOrderId(event);
  if (!razorpayOrderId) {
    return NextResponse.json({ received: true });
  }

  await appendPaymentEvent({
    razorpayOrderId,
    eventType: `webhook.${eventType}`,
    payload: rawBody,
  });

  if (eventType === "payment.captured" || eventType === "order.paid") {
    const paymentId = event.payload?.payment?.entity?.id;
    if (paymentId) {
      await markPaymentOrderPaid({
        razorpayOrderId,
        razorpayPaymentId: paymentId,
      });
    }
  }

  if (eventType === "payment.failed") {
    const reason = event.payload?.payment?.entity?.error_description ?? "Payment failed.";
    await markPaymentOrderFailed({
      razorpayOrderId,
      reason,
    });
  }

  return NextResponse.json({ received: true });
}
