import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

// POST /api/recommendations – stubbed recommendation engine
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { area, budget, goal } = body as {
    area: string;
    budget: number;
    goal?: string;
  };

  if (!area || !budget) {
    return NextResponse.json({ error: "Area and budget are required" }, { status: 400 });
  }

  const suggestion = {
    area,
    budget,
    goal,
    mix: [
      {
        service: "PAMPHLET_DISTRIBUTION",
        share: 0.4,
        comment: "High household reach in societies."
      },
      {
        service: "FLEX_BANNER",
        share: 0.3,
        comment: "Visibility on main roads."
      },
      {
        service: "SUNPACK_SHEET",
        share: 0.3,
        comment: "Longer-term branding near institutes/markets."
      }
    ]
  };

  const record = await prisma.recommendationRequest.create({
    data: {
      area,
      budget,
      goal,
      suggestion
    }
  });

  return NextResponse.json({ recommendation: record });
}

