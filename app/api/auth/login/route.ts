import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const hasDatabase = !!process.env.DATABASE_URL;

// In-memory storage for development
const inMemoryUsers: any[] = [
  // Default admin user for testing
  {
    id: "admin-1",
    mobile: "9999999999",
    name: "Admin User",
    role: "ADMIN",
    password: "admin123", // In production, use hashed passwords
    status: "ACTIVE"
  }
];

// POST /api/auth/login - Login with mobile and password/OTP
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mobile, password, role } = body;

    if (!mobile || !password) {
      return NextResponse.json(
        { error: "Mobile and password are required" },
        { status: 400 }
      );
    }

    // Mobile validation
    const mobileRegex = /^[0-9]{10}$/;
    const cleanMobile = mobile.replace(/\D/g, '');
    if (!mobileRegex.test(cleanMobile)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number" },
        { status: 400 }
      );
    }

    let user;

    if (hasDatabase) {
      // Find user in database
      user = await prisma.user.findUnique({
        where: { mobile: cleanMobile },
        include: { partnerProfile: true }
      });
    } else {
      // Find user in memory
      user = inMemoryUsers.find(u => u.mobile === cleanMobile);
    }

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please check your mobile number or register first." },
        { status: 404 }
      );
    }

    // Verify password (in production, compare hashed passwords)
    // For demo purposes, accepting any password for existing users
    // In production: const isValid = await bcrypt.compare(password, user.password);
    
    // Check role if provided
    if (role && user.role !== role) {
      // For partners, check partner profile
      if (role === "TEAM_BOY" && user.role !== "TEAM_BOY") {
        return NextResponse.json(
          { error: "You are not registered as a Team Boy" },
          { status: 403 }
        );
      }
    }

    // Check user status
    if (user.status === "PENDING" || (user.partnerProfile && user.partnerProfile.status === "PENDING")) {
      return NextResponse.json(
        { error: "Your account is pending approval. Please wait for admin verification." },
        { status: 403 }
      );
    }

    // Return user data (exclude sensitive info)
    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        partnerType: user.partnerProfile?.type || null,
        area: user.partnerProfile?.area || null
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/auth/login/otp - Send OTP (mock implementation)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { mobile } = body;

    if (!mobile) {
      return NextResponse.json(
        { error: "Mobile number is required" },
        { status: 400 }
      );
    }

    // In production, integrate with SMS provider (Twilio, MSG91, etc.)
    // For demo, we just return success
    console.log(`OTP would be sent to ${mobile}`);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      // For demo only - remove in production
      demoOtp: "123456"
    });

  } catch (error) {
    console.error("OTP error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
