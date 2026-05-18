import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/adminAuth";
import connectToDatabase from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validateTestimonialPayload(payload) {
  if (!payload.studentName?.trim()) return "Student name is required.";
  if (!payload.course?.trim()) return "Course is required.";
  if (!payload.review?.trim()) return "Review is required.";
  return null;
}

export async function GET() {
  try {
    await connectToDatabase();
    const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch testimonials.", error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    await requireAdminAccess();
    await connectToDatabase();
    const body = await request.json();
    const errorMessage = validateTestimonialPayload(body);

    if (errorMessage) {
      return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
    }

    const testimonial = await Testimonial.create(body);
    return NextResponse.json({ success: true, data: testimonial }, { status: 201 });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json(
      { success: false, message: "Failed to create testimonial.", error: error.message },
      { status },
    );
  }
}
