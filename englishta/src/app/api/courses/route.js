import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/adminAuth";
import connectToDatabase from "@/lib/mongodb";
import Course from "@/models/Course";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    const courses = await Course.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    console.error("Failed to fetch courses:", error);

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
    await requireAdminAccess();
    await connectToDatabase();
    const body = await request.json();

    if (!body.name?.trim() || !body.thumbnail?.trim() || !body.shortDescription?.trim() || !body.longDescription?.trim()) {
      return NextResponse.json({ success: false, message: "Please fill all required course fields." }, { status: 400 });
    }

    const course = await Course.create(body);

    return NextResponse.json({ success: true, data: course }, { status: 201 });
  } catch (error) {
    const status = error.status || 400;
    console.error("Failed to create course:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create course.",
        error: error.message,
      },
      { status },
    );
  }
}
