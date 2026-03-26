"use client";

import { useEffect, useState, useTransition } from "react";

type RazorpaySuccessPayload = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayFailurePayload = {
  error?: {
    description?: string;
  };
};

type RazorpayInstance = {
  open: () => void;
  on: (event: "payment.failed", handler: (response: RazorpayFailurePayload) => void) => void;
};

type RazorpayOptions = {
  key?: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  image?: string;
  theme?: { color: string };
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  handler: (response: RazorpaySuccessPayload) => void;
  modal?: {
    ondismiss?: () => void;
  };
};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayButtonProps {
  planName: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

type CreateOrderResponse = {
  keyId?: string;
  orderId: string;
  amount: number;
  currency: string;
  planName: string;
  testMode?: boolean;
  message?: string;
};

type VerifyResponse = {
  message?: string;
  redirect?: string;
  loginUrl?: string;
};

type SessionResponse = {
  authenticated?: boolean;
};

type CreateOrderError = {
  message?: string;
  loginUrl?: string;
};

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function RazorpayButton({
  planName,
  description = "VisaGuru Visa Recovery Service",
  className = "",
  children,
}: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "guest">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const data = (await response.json()) as SessionResponse;
        if (!cancelled) {
          setAuthState(data.authenticated ? "authenticated" : "guest");
        }
      } catch {
        if (!cancelled) {
          setAuthState("guest");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePayment = () => {
    if (authState === "guest") {
      window.location.assign("/login?next=/#free-analysis");
      return;
    }

    startTransition(async () => {
      setLoading(true);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Payment service is unavailable. Please try again later.");
        setLoading(false);
        return;
      }

      try {
        const orderRes = await fetch("/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planName }),
        });
        const orderData = (await orderRes.json()) as CreateOrderResponse;

        if (orderRes.status === 401) {
          const authError = orderData as unknown as CreateOrderError;
          window.location.assign(authError.loginUrl ?? "/login?next=/#free-analysis");
          return;
        }

        if (!orderRes.ok) {
          alert(orderData.message || "Unable to create payment order.");
          setLoading(false);
          return;
        }

        if (orderData.testMode) {
          window.location.assign("/dashboard?payment=test");
          return;
        }

        const options: RazorpayOptions = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "VisaGuru",
          description: `${orderData.planName} - ${description}`,
          order_id: orderData.orderId,
          image: "/images/approved-document.svg",
          theme: { color: "#1A2744" },
          handler: async (response) => {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyData = (await verifyRes.json()) as VerifyResponse;
            if (verifyRes.status === 401) {
              window.location.assign(
                verifyData.loginUrl ?? "/login?next=/dashboard",
              );
              return;
            }
            if (!verifyRes.ok) {
              alert(verifyData.message || "Payment verification failed.");
              setLoading(false);
              return;
            }
            window.location.assign(verifyData.redirect ?? "/dashboard?payment=success");
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
            },
          },
        };

        const checkout = new window.Razorpay(options);
        checkout.on("payment.failed", (response) => {
          alert(response.error?.description || "Payment failed. Please try again.");
          setLoading(false);
        });
        checkout.open();
        setLoading(false);
      } catch {
        alert("Something went wrong. Please try again.");
        setLoading(false);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={loading || isPending || authState === "loading"}
      className={`${className} ${loading || isPending ? "cursor-wait opacity-70" : ""}`}
    >
      {authState === "loading" ? (
        "Checking account..."
      ) : authState === "guest" ? (
        "Login to Continue"
      ) : loading || isPending ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              className="opacity-25"
            />
            <path
              d="M4 12a8 8 0 0 1 8-8"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="opacity-75"
            />
          </svg>
          Processing...
        </span>
      ) : (
        children ?? "Pay Now"
      )}
    </button>
  );
}
