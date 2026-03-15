import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const hasDatabase = !!process.env.DATABASE_URL;

// In-memory storage for development
const inMemoryRecommendations: any[] = [];

// POST /api/recommendations – recommendation engine
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { area, budget, goal, audience } = body as {
      area: string;
      budget: number;
      goal?: string;
      audience?: string;
    };

    if (!area || !budget) {
      return NextResponse.json({ error: "Area and budget are required" }, { status: 400 });
    }

    // Generate smart recommendations based on budget and area
    const recommendation = generateRecommendation(area, budget, goal, audience);

    let record;
    
    if (hasDatabase) {
      record = await prisma.recommendationRequest.create({
        data: {
          area,
          budget,
          goal,
          suggestion: recommendation
        }
      });
    } else {
      record = {
        id: `rec-${Date.now()}`,
        area,
        budget,
        goal,
        suggestion: recommendation,
        createdAt: new Date().toISOString()
      };
      inMemoryRecommendations.push(record);
    }

    return NextResponse.json({ 
      success: true,
      recommendation: {
        ...record,
        suggestion: recommendation
      }
    });
  } catch (error) {
    console.error("Error generating recommendation:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendation" },
      { status: 500 }
    );
  }
}

// Smart recommendation engine
function generateRecommendation(area: string, budget: number, goal?: string, audience?: string) {
  const areaLower = area.toLowerCase();
  
  // Area-based route suggestions
  const areaRoutes: Record<string, string[]> = {
    "pratap": ["Tonk Road", "Pratap Nagar Market", "Gopalpura Bypass"],
    "jagatpura": ["Jagatpura Main Road", "Near Colleges", "Malviya Nagar Extension"],
    "sitapura": ["Sitapura Industrial Area", "RIICO", "Mahapura"],
    "sanganer": ["Sanganer Airport Road", "Prithviraj Nagar", "Durgapura"],
    "tonk": ["Tonk Road", "Gopalpura", "Shyam Nagar"],
    "malviya": ["Malviya Nagar Market", "Durgapura", "Jawahar Circle"]
  };
  
  // Find matching routes
  let routes: string[] = ["Main Market Area", "Residential Societies", "Commercial Complex"];
  for (const [key, value] of Object.entries(areaRoutes)) {
    if (areaLower.includes(key)) {
      routes = value;
      break;
    }
  }

  // Budget-based media mix
  let mix = [];
  
  if (budget < 5000) {
    mix = [
      { service: "PAMPHLET_DISTRIBUTION", share: 0.7, estimatedCost: Math.round(budget * 0.7), comment: "High household reach in societies" },
      { service: "WALL_POSTER", share: 0.3, estimatedCost: Math.round(budget * 0.3), comment: "Strategic placement in high-footfall areas" }
    ];
  } else if (budget < 15000) {
    mix = [
      { service: "PAMPHLET_DISTRIBUTION", share: 0.4, estimatedCost: Math.round(budget * 0.4), comment: "Door-to-door coverage" },
      { service: "FLEX_BANNER", share: 0.35, estimatedCost: Math.round(budget * 0.35), comment: "Main road visibility" },
      { service: "WALL_POSTER", share: 0.25, estimatedCost: Math.round(budget * 0.25), comment: "Local market presence" }
    ];
  } else if (budget < 30000) {
    mix = [
      { service: "PAMPHLET_DISTRIBUTION", share: 0.3, estimatedCost: Math.round(budget * 0.3), comment: "Society coverage" },
      { service: "FLEX_BANNER", share: 0.3, estimatedCost: Math.round(budget * 0.3), comment: "High-traffic junctions" },
      { service: "SUNPACK_SHEET", share: 0.25, estimatedCost: Math.round(budget * 0.25), comment: "Long-term branding" },
      { service: "ELECTRIC_POLE_AD", share: 0.15, estimatedCost: Math.round(budget * 0.15), comment: "Route visibility" }
    ];
  } else {
    mix = [
      { service: "PAMPHLET_DISTRIBUTION", share: 0.25, estimatedCost: Math.round(budget * 0.25), comment: "Extensive society coverage" },
      { service: "FLEX_BANNER", share: 0.25, estimatedCost: Math.round(budget * 0.25), comment: "Premium locations" },
      { service: "SUNPACK_SHEET", share: 0.25, estimatedCost: Math.round(budget * 0.25), comment: "College/Market areas" },
      { service: "ELECTRIC_POLE_AD", share: 0.15, estimatedCost: Math.round(budget * 0.15), comment: "Main road coverage" },
      { service: "WALL_POSTER", share: 0.1, estimatedCost: Math.round(budget * 0.1), comment: "Targeted hotspots" }
    ];
  }

  // Goal-based adjustments
  const goalLower = goal?.toLowerCase() || "";
  let addons: string[] = [];
  
  if (goalLower.includes("launch") || goalLower.includes("opening")) {
    addons = ["Grand Opening Banner", "Balloon Decoration", "Social Media Boost"];
  } else if (goalLower.includes("admission") || goalLower.includes("education")) {
    addons = ["College Campus Posters", "Pamphlet in Coaching Centers", "Parent-targeted Distribution"];
  } else if (goalLower.includes("festival") || goalLower.includes("seasonal")) {
    addons = ["Festive Themed Flex", "Seasonal Discount Posters", "Special Event Banner"];
  } else if (goalLower.includes("brand") || goalLower.includes("awareness")) {
    addons = ["Premium Sunpack Locations", "Long-term Flex Contract", "Society Notice Board Ads"];
  }

  // Seasonal suggestions
  const month = new Date().getMonth();
  const seasonalAddons: string[] = [];
  if (month >= 2 && month <= 4) seasonalAddons.push("Summer Campaign Special", "AC/ Cooler Service Ads");
  if (month >= 9 && month <= 11) seasonalAddons.push("Diwali Festival Package", "Wedding Season Special");
  if (month >= 0 && month <= 1) seasonalAddons.push("New Year Launch", "Republic Day Offers");

  return {
    area,
    budget,
    goal,
    audience,
    mediaMix: mix,
    routes,
    suggestedAddons: [...addons, ...seasonalAddons],
    estimatedReach: Math.round(budget * 0.5), // Rough estimate: 1 INR = 0.5 people
    campaignDuration: budget < 10000 ? "7-10 days" : budget < 25000 ? "15-20 days" : "30 days",
    notes: `Optimized mix for ${area} with focus on ${goal || "maximum reach"}. Best results during 10AM-6PM.`
  };
}

