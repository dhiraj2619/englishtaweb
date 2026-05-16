import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/adminAuth";
import connectToDatabase from "@/lib/mongodb";
import Webinar from "@/models/Webinar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validateWebinarPayload(payload) {
  if (!payload.title?.trim()) return "Title is required.";
  if (!payload.dateTime?.trim()) return "Date and time are required.";
  if (!payload.link?.trim()) return "Link is required.";
  if (!payload.description?.trim()) return "Description is required.";
  return null;
}

export async function GET() {
  try {
    await connectToDatabase();
    const webinars = await Webinar.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: webinars });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch webinars.", error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await requireAdminAccess();
    await connectToDatabase();
    const body = await request.json();
    const errorMessage = validateWebinarPayload(body);

    if (errorMessage) {
      return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
    }

    const webinar = await Webinar.create(body);
    return NextResponse.json({ success: true, data: webinar }, { status: 201 });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ success: false, message: "Failed to create webinar.", error: error.message }, { status });
  }
}
