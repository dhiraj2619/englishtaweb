import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/adminAuth";
import connectToDatabase from "@/lib/mongodb";
import Webinar from "@/models/Webinar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validateWebinarPayload(payload) {
  if (!payload.title?.trim()) return "Title is required.";
  if (!payload.thumbnail?.trim()) return "Thumbnail is required.";
  if (!payload.dateTime?.trim()) return "Date and time are required.";
  if (!payload.link?.trim()) return "Link is required.";
  if (!payload.description?.trim()) return "Description is required.";
  return null;
}

export async function GET(_request, { params }) {
  try {
    await connectToDatabase();
    const webinar = await Webinar.findById(params.id).lean();

    if (!webinar) {
      return NextResponse.json({ success: false, message: "Webinar not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: webinar });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch webinar.", error: error.message }, { status: 400 });
  }
}

export async function PUT(request, { params }) {
  try {
    await requireAdminAccess();
    await connectToDatabase();
    const body = await request.json();
    const errorMessage = validateWebinarPayload(body);

    if (errorMessage) {
      return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
    }

    const webinar = await Webinar.findByIdAndUpdate(params.id, body, { new: true, runValidators: true }).lean();

    if (!webinar) {
      return NextResponse.json({ success: false, message: "Webinar not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: webinar });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ success: false, message: "Failed to update webinar.", error: error.message }, { status });
  }
}

export async function DELETE(_request, { params }) {
  try {
    await requireAdminAccess();
    await connectToDatabase();
    const webinar = await Webinar.findByIdAndDelete(params.id).lean();

    if (!webinar) {
      return NextResponse.json({ success: false, message: "Webinar not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: webinar });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ success: false, message: "Failed to delete webinar.", error: error.message }, { status });
  }
}
