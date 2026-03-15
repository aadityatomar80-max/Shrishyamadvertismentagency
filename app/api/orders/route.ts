import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ServiceType, OrderStatus } from "@prisma/client";

// In-memory storage for development (when no database is configured)
const inMemoryOrders: any[] = [];
let orderCounter = 1000;
const hasDatabase = !!process.env.DATABASE_URL;

// GET /api/orders – list orders for admin dashboard
export async function GET() {
  try {
    let orders;
    
    if (hasDatabase) {
      orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          client: { select: { id: true, name: true, mobile: true } },
          partner: { select: { id: true, type: true, area: true } },
          teamBoy: { select: { id: true, type: true, area: true } }
        }
      });
    } else {
      orders = [...inMemoryOrders].reverse();
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST /api/orders – create an order from client
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validation
    if (!body.clientName || !body.clientMobile || !body.clientArea || !body.serviceType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate service type
    const validServiceTypes = [
      "PAMPHLET_DISTRIBUTION",
      "FLEX_BANNER",
      "ELECTRIC_POLE_AD",
      "SUNPACK_SHEET",
      "WALL_POSTER",
      "LOCAL_PROMOTION_PACKAGE"
    ];
    if (!validServiceTypes.includes(body.serviceType)) {
      return NextResponse.json(
        { error: "Invalid service type" },
        { status: 400 }
      );
    }

    let order;
    
    if (hasDatabase) {
      // Generate public ID (e.g., SSA-1001)
      const lastOrder = await prisma.order.findFirst({
        orderBy: { createdAt: "desc" }
      });
      const nextId = lastOrder ? parseInt(lastOrder.publicId.split("-")[1]) + 1 : 1001;
      const publicId = `SSA-${nextId}`;

      // Create order in database
      order = await prisma.order.create({
        data: {
          publicId,
          clientName: body.clientName,
          clientMobile: body.clientMobile,
          clientArea: body.clientArea,
          serviceType: body.serviceType as ServiceType,
          status: OrderStatus.PENDING,
          budget: body.budget ? parseFloat(body.budget) : null
        }
      });
    } else {
      // In-memory storage for development
      orderCounter++;
      order = {
        id: `order-${Date.now()}`,
        publicId: `SSA-${orderCounter}`,
        clientName: body.clientName,
        clientMobile: body.clientMobile,
        clientArea: body.clientArea,
        serviceType: body.serviceType,
        status: "PENDING",
        budget: body.budget ? parseFloat(body.budget) : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      inMemoryOrders.push(order);
    }

    console.log("New order created:", order);

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order: {
        id: order.id,
        publicId: order.publicId,
        clientName: order.clientName,
        status: order.status
      }
    });

  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

