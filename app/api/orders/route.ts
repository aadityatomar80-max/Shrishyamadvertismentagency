import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { ServiceType, OrderStatus } from "@prisma/client";
import { sendOrderConfirmation } from "../../../lib/notifications";

// GET /api/orders – simple list for admin dashboard
export async function GET() {
  const orders = await prisma.order.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      partner: true,
      teamBoy: true
    }
  });

  return NextResponse.json({ orders });
}

// POST /api/orders – stub to create an order from client or partner
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    clientName,
    clientMobile,
    clientArea,
    serviceType,
    budget,
    createdById
  } = body as {
    clientName: string;
    clientMobile: string;
    clientArea: string;
    serviceType: ServiceType;
    budget?: string | number;
    createdById?: string;
  };

  if (!clientName || !clientMobile || !clientArea || !serviceType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const count = await prisma.order.count();
  const publicId = `SSA-${1000 + count}`;

  const order = await prisma.order.create({
    data: {
      publicId,
      clientName,
      clientMobile,
      clientArea,
      serviceType,
      status: OrderStatus.PENDING,
      budget: budget ? Number(budget) : null,
      createdById: createdById ?? null
    }
  });

  await sendOrderConfirmation({ order });

  return NextResponse.json({ order }, { status: 201 });
}

