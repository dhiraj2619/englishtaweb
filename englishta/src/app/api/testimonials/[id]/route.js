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

export async function PUT(request, { params }) {
  try {
    await requireAdminAccess();
    await connectToDatabase();
    const body = await request.json();
    const errorMessage = validateTestimonialPayload(body);

    if (errorMessage) {
      return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
    }

    const testimonial = await Testimonial.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!testimonial) {
      return NextResponse.json({ success: false, message: "Testimonial not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json(
      { success: false, message: "Failed to update testimonial.", error: error.message },
      { status },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    await requireAdminAccess();
    await connectToDatabase();

    const testimonial = await Testimonial.findByIdAndDelete(params.id);

    if (!testimonial) {
      return NextResponse.json({ success: false, message: "Testimonial not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json(
      { success: false, message: "Failed to delete testimonial.", error: error.message },
      { status },
    );
  }
}
