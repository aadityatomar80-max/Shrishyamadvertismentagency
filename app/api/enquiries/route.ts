import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// In-memory storage for development (when no database is configured)
const inMemoryEnquiries: any[] = [];
const hasDatabase = !!process.env.DATABASE_URL;

// POST /api/enquiries - Handle enquiry submissions
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const { name, mobile, location, requirement } = body;
    
    // Validation
    if (!name || !mobile || !location || !requirement) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    
    // Mobile number validation (basic)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile.replace(/\D/g, ''))) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number" },
        { status: 400 }
      );
    }
    
    let enquiry;
    
    if (hasDatabase) {
      // Save enquiry to database
      enquiry = await prisma.enquiry.create({
        data: {
          name,
          mobile,
          location,
          requirement,
          status: "PENDING"
        }
      });
    } else {
      // In-memory storage for development
      enquiry = {
        id: `enq-${Date.now()}`,
        name,
        mobile,
        location,
        requirement,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      inMemoryEnquiries.push(enquiry);
    }
    
    console.log("New enquiry saved:", enquiry);
    
    // TODO: Add email/WhatsApp notifications here
    
    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully",
      enquiry: {
        id: enquiry.id,
        name: enquiry.name,
        status: enquiry.status
      }
    });
    
  } catch (error) {
    console.error("Error processing enquiry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/enquiries - Get all enquiries (admin only)
export async function GET(req: NextRequest) {
  try {
    // In production, you'd verify admin authentication here
    
    let enquiries;
    
    if (hasDatabase) {
      enquiries = await prisma.enquiry.findMany({
        orderBy: { createdAt: "desc" }
      });
    } else {
      enquiries = [...inMemoryEnquiries].reverse();
    }
    
    return NextResponse.json({
      enquiries,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
