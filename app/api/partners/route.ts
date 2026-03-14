import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { sendPartnerApplicationEmail } from "../../../lib/notifications";

// GET /api/partners – list partners (basic stub with filters later)
export async function GET() {
  const partners = await prisma.partnerProfile.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, mobile: true, role: true }
      }
    }
  });

  return NextResponse.json({ partners });
}

// POST /api/partners – create partner from onboarding form
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !body.mobile || !body.name || !body.type || !body.area) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { mobile, name, type, area, idProofUrl } = body as {
    mobile: string;
    name: string;
    type: "TEAM_BOY" | "PRINTING_SHOP" | "AGENCY";
    area: string;
    idProofUrl?: string;
  };

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { mobile },
      update: { name },
      create: {
        mobile,
        name,
        role: type === "TEAM_BOY" ? "TEAM_BOY" : "PRINTING_SHOP"
      }
    });

    const partner = await tx.partnerProfile.upsert({
      where: { userId: user.id },
      update: { type, area, idProofUrl },
      create: {
        userId: user.id,
        type,
        area,
        idProofUrl
      }
    });

    await sendPartnerApplicationEmail({ user, partner });
    return { user, partner };
  });

  return NextResponse.json(result, { status: 201 });
}

