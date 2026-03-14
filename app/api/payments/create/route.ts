import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { PaymentProvider, PaymentStatus } from "@prisma/client";

// POST /api/payments/create – stub to start a Razorpay/Paytm checkout
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { orderId, amount, provider, userId } = body as {
    orderId: string;
    amount: number;
    provider: PaymentProvider;
    userId?: string;
  };

  if (!orderId || !amount || !provider) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const payment = await prisma.payment.create({
    data: {
      orderId,
      amount,
      provider,
      status: PaymentStatus.CREATED,
      userId
    }
  });

  // In real integration, call Razorpay/Paytm here and return checkout/session details.
  return NextResponse.json(
    {
      payment,
      gateway: {
        provider,
        checkoutUrl: "https://example-gateway.test/checkout/placeholder"
      }
    },
    { status: 201 }
  );
}

