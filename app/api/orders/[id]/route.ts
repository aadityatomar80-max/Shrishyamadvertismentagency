import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { OrderStatus } from "@prisma/client";

type Params = {
  params: {
    id: string;
  };
};

// GET /api/orders/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      partner: true,
      teamBoy: true,
      payments: true
    }
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}

// PATCH /api/orders/[id] – update status / assignees (for Admin workflow)
export async function PATCH(req: NextRequest, { params }: Params) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { status, partnerId, teamBoyId } = body as {
    status?: OrderStatus;
    partnerId?: string | null;
    teamBoyId?: string | null;
  };

  const order = await prisma.order.update({
    where: { id: params.id },
    data: {
      status,
      partnerId: partnerId ?? undefined,
      teamBoyId: teamBoyId ?? undefined
    }
  });

  return NextResponse.json({ order });
}

