import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole, PartnerType } from "@prisma/client";

// In-memory storage for development (when no database is configured)
const inMemoryUsers: any[] = [];
const inMemoryPartners: any[] = [];
const hasDatabase = !!process.env.DATABASE_URL;

// GET /api/partners – list all partners
export async function GET() {
  try {
    let partners;
    
    if (hasDatabase) {
      partners = await prisma.partnerProfile.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, mobile: true } }
        }
      });
    } else {
      // Map in-memory partners with user data
      partners = inMemoryPartners.map(partner => {
        const user = inMemoryUsers.find(u => u.id === partner.userId);
        return {
          ...partner,
          user: user ? { id: user.id, name: user.name, mobile: user.mobile } : null
        };
      }).reverse();
    }

    return NextResponse.json({ partners });
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json(
      { error: "Failed to fetch partners" },
      { status: 500 }
    );
  }
}

// POST /api/partners – create partner from onboarding form
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validation
    if (!body.name || !body.mobile || !body.type || !body.area) {
      return NextResponse.json(
        { error: "Missing required fields: name, mobile, type, area" },
        { status: 400 }
      );
    }

    // Mobile number validation
    const mobileRegex = /^[0-9]{10}$/;
    const cleanMobile = body.mobile.replace(/\D/g, '');
    if (!mobileRegex.test(cleanMobile)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number" },
        { status: 400 }
      );
    }

    // Validate partner type
    const validTypes = ["TEAM_BOY", "PRINTING_SHOP", "AGENCY"];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { error: "Invalid partner type. Must be TEAM_BOY, PRINTING_SHOP, or AGENCY" },
        { status: 400 }
      );
    }

    let user;
    let partner;
    
    if (hasDatabase) {
      // Check if user already exists
      user = await prisma.user.findUnique({
        where: { mobile: cleanMobile }
      });

      if (user) {
        // Check if already a partner
        const existingPartner = await prisma.partnerProfile.findUnique({
          where: { userId: user.id }
        });
        
        if (existingPartner) {
          return NextResponse.json(
            { error: "You have already submitted a partner application" },
            { status: 400 }
          );
        }
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            mobile: cleanMobile,
            name: body.name,
            role: UserRole.TEAM_BOY
          }
        });
      }

      // Create partner profile
      partner = await prisma.partnerProfile.create({
        data: {
          userId: user.id,
          type: body.type as PartnerType,
          area: body.area,
          status: "PENDING"
        }
      });
    } else {
      // In-memory storage for development
      const existingUser = inMemoryUsers.find(u => u.mobile === cleanMobile);
      
      if (existingUser) {
        const existingPartner = inMemoryPartners.find(p => p.userId === existingUser.id);
        if (existingPartner) {
          return NextResponse.json(
            { error: "You have already submitted a partner application" },
            { status: 400 }
          );
        }
        user = existingUser;
      } else {
        user = {
          id: `user-${Date.now()}`,
          mobile: cleanMobile,
          name: body.name,
          role: "TEAM_BOY",
          createdAt: new Date().toISOString()
        };
        inMemoryUsers.push(user);
      }
      
      partner = {
        id: `partner-${Date.now()}`,
        userId: user.id,
        type: body.type,
        area: body.area,
        status: "PENDING",
        createdAt: new Date().toISOString()
      };
      inMemoryPartners.push(partner);
    }

    console.log("New partner application:", { user, partner });

    return NextResponse.json({
      success: true,
      message: "Partner application submitted successfully",
      partner: {
        id: partner.id,
        name: user.name,
        type: partner.type,
        area: partner.area,
        status: partner.status
      }
    });
    
  } catch (error) {
    console.error("Error processing partner application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

