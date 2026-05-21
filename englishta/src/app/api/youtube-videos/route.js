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

export async function GET() {
  try {
    await connectToDatabase();
    const videos = await YoutubeVideo.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: videos });
  } catch (error) {
    console.error("Failed to fetch YouTube videos:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch YouTube videos.",
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
    const errorMessage = validateYoutubeVideoPayload(body);

    if (errorMessage) {
      return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
    }

    const video = await YoutubeVideo.create(normalizeYoutubeVideoPayload(body));

    return NextResponse.json({ success: true, data: video }, { status: 201 });
  } catch (error) {
    const status = error.status || 400;
    console.error("Failed to create YouTube video:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create YouTube video.",
        error: error.message,
      },
      { status },
    );
  }
}
