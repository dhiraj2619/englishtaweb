import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import Course from "@/models/Course";

export async function GET(_request, { params }) {
  try {
    await connectToDatabase();
    const course = await Course.findById(params.id).lean();

    if (!course) {
      return NextResponse.json({ success: false, message: "Course not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch course.", error: error.message },
      { status: 400 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const course = await Course.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!course) {
      return NextResponse.json({ success: false, message: "Course not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update course.", error: error.message },
      { status: 400 },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    await connectToDatabase();
    const course = await Course.findByIdAndDelete(params.id).lean();

    if (!course) {
      return NextResponse.json({ success: false, message: "Course not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete course.", error: error.message },
      { status: 400 },
    );
  }
}
