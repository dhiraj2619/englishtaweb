import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/adminAuth";
import connectToDatabase from "@/lib/mongodb";
import YoutubeVideo from "@/models/YoutubeVideo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validateYoutubeVideoPayload(payload) {
  if (!payload.title?.trim() || !payload.youtubeIframe?.trim()) {
    return "Title and YouTube iframe are required.";
  }

  return null;
}

function normalizeYoutubeVideoPayload(payload) {
  return {
    title: payload.title?.trim() || "",
    youtubeIframe: payload.youtubeIframe?.trim() || "",
    visible: payload.visible === "No" ? "No" : "Yes",
  };
}

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const video = await YoutubeVideo.findById(id).lean();

    if (!video) {
      return NextResponse.json({ success: false, message: "YouTube video not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: video });
  } catch (error) {
    console.error("Failed to fetch YouTube video:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch YouTube video.", error: error.message },
      { status: 400 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    await requireAdminAccess();
    await connectToDatabase();
    const body = await request.json();
    const errorMessage = validateYoutubeVideoPayload(body);

    if (errorMessage) {
      return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
    }

    const video = await YoutubeVideo.findByIdAndUpdate(id, normalizeYoutubeVideoPayload(body), {
      new: true,
      runValidators: true,
    }).lean();

    if (!video) {
      return NextResponse.json({ success: false, message: "YouTube video not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: video });
  } catch (error) {
    const status = error.status || 400;
    console.error("Failed to update YouTube video:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Failed to update YouTube video.", error: error.message },
      { status },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    await requireAdminAccess();
    await connectToDatabase();
    const video = await YoutubeVideo.findByIdAndDelete(id).lean();

    if (!video) {
      return NextResponse.json({ success: false, message: "YouTube video not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: video });
  } catch (error) {
    const status = error.status || 400;
    console.error("Failed to delete YouTube video:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete YouTube video.", error: error.message },
      { status },
    );
  }
}
