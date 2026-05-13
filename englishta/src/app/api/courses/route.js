import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import Course from "@/models/Course";

export async function GET() {
  try {
    await connectToDatabase();
    const courses = await Course.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch courses.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const course = await Course.create(body);

    return NextResponse.json({ success: true, data: course }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create course.",
        error: error.message,
      },
      { status: 400 },
    );
  }
}
