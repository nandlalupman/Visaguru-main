import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyRazorpaySignature } from "@/lib/security";
import {
  appendPaymentEvent,
  findPaymentOrderByRazorpayOrderId,
  markPaymentOrderFailed,
  markPaymentOrderPaid,
} from "@/lib/store";
import { enforceRateLimit, getRequestIdentifier } from "@/lib/rate-limit";
import { getCurrentSession } from "@/lib/session";

export const runtime = "nodejs";

const schema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { message: "Please log in to verify payment.", loginUrl: "/login?next=/dashboard" },
        { status: 401 },
      );
    }

    const identifier = getRequestIdentifier(request.headers.get("x-forwarded-for"));
    const rate = await enforceRateLimit({
      bucket: "payment_verify",
      identifier,
      limit: 20,
      windowMs: 60_000,
    });
    if (!rate.allowed) {
      return NextResponse.json(
        { message: "Too many verification attempts. Please wait." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid payment verification payload." }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { message: "Payment verification is not configured." },
        { status: 503 },
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;
    const order = await findPaymentOrderByRazorpayOrderId(razorpay_order_id);
    if (!order) {
      return NextResponse.json({ message: "Payment order not found." }, { status: 404 });
    }
    if (order.userId && order.userId !== session.userId) {
      return NextResponse.json({ message: "This payment order does not belong to your account." }, { status: 403 });
    }

    const valid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      secret,
    });
    if (!valid) {
      const failed = await markPaymentOrderFailed({
        razorpayOrderId: razorpay_order_id,
        reason: "Invalid Razorpay signature.",
      });
      if (!failed) {
        return NextResponse.json({ message: "Payment order not found." }, { status: 404 });
      }
      await appendPaymentEvent({
        razorpayOrderId: razorpay_order_id,
        eventType: "payment.verify.invalid_signature",
        payload: JSON.stringify({
          razorpay_payment_id,
        }),
      });
      return NextResponse.json(
        { message: "Payment verification failed. Please contact support." },
        { status: 400 },
      );
    }

    const paid = await markPaymentOrderPaid({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });
    if (!paid) {
      return NextResponse.json({ message: "Payment order not found." }, { status: 404 });
    }
    await appendPaymentEvent({
      razorpayOrderId: razorpay_order_id,
      eventType: "payment.verify.success",
      payload: JSON.stringify({ razorpay_payment_id }),
    });

    return NextResponse.json({
      message: "Payment verified successfully.",
      redirect: "/dashboard?payment=success",
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to verify payment right now." },
      { status: 500 },
    );
  }
}
