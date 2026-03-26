import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/session";
import { PAYMENT_PLANS, isPaymentPlanName } from "@/lib/payment";
import { appendPaymentEvent, createPaymentOrder } from "@/lib/store";
import { enforceRateLimit, getRequestIdentifier } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({
  planName: z.string().min(1),
});

type RazorpayOrderResponse = {
  id: string;
  amount: number;
  currency: string;
};

export async function POST(request: NextRequest) {
  try {
    const identifier = getRequestIdentifier(request.headers.get("x-forwarded-for"));
    const rate = await enforceRateLimit({
      bucket: "payment_order_create",
      identifier,
      limit: 8,
      windowMs: 60_000,
    });
    if (!rate.allowed) {
      return NextResponse.json(
        { message: "Too many payment attempts. Please wait a minute." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid payment request." }, { status: 400 });
    }

    const { planName } = parsed.data;
    if (!isPaymentPlanName(planName)) {
      return NextResponse.json({ message: "Invalid plan selected." }, { status: 400 });
    }

    const plan = PAYMENT_PLANS[planName];
    const amountInPaise = plan.amountInInr * 100;
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        {
          message: "Please log in to place an order.",
          loginUrl: "/login?next=/#free-analysis",
        },
        { status: 401 },
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { message: "Payment gateway is not configured for this deployment." },
          { status: 503 },
        );
      }

      const orderId = `order_local_${Date.now()}`;
      await createPaymentOrder({
        razorpayOrderId: orderId,
        planName,
        amount: plan.amountInInr,
        currency: plan.currency,
        userId: session.userId,
        email: session.email,
      });
      await appendPaymentEvent({
        razorpayOrderId: orderId,
        eventType: "payment.order.local",
        payload: JSON.stringify({ planName, amount: plan.amountInInr }),
      });

      return NextResponse.json({
        testMode: true,
        message:
          "Razorpay keys are not configured. This checkout is running in local test mode.",
        orderId,
        amount: amountInPaise,
        currency: plan.currency,
        planName,
      });
    }

    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: plan.currency,
        receipt: `receipt_${Date.now()}`,
        notes: {
          plan: planName,
          userId: session.userId,
        },
      }),
    });

    if (!orderRes.ok) {
      const errorData = await orderRes.text();
      console.error("Razorpay order creation failed:", errorData);
      return NextResponse.json(
        { message: "Unable to create payment order. Please try again." },
        { status: 502 },
      );
    }

    const order = (await orderRes.json()) as RazorpayOrderResponse;
    await createPaymentOrder({
      razorpayOrderId: order.id,
      planName,
      amount: plan.amountInInr,
      currency: order.currency,
      userId: session.userId,
      email: session.email,
    });
    await appendPaymentEvent({
      razorpayOrderId: order.id,
      eventType: "payment.order.created",
      payload: JSON.stringify({ planName, amount: plan.amountInInr }),
    });

    return NextResponse.json({
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      planName,
    });
  } catch {
    return NextResponse.json(
      { message: "Payment service error. Please try again." },
      { status: 500 },
    );
  }
}
