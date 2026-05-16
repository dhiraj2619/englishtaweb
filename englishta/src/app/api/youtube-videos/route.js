import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/adminAuth";
import connectToDatabase from "@/lib/mongodb";
import YoutubeVideo from "@/models/YoutubeVideo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

    if (!body.title?.trim() || !body.youtubeIframe?.trim()) {
      return NextResponse.json({ success: false, message: "Title and YouTube iframe are required." }, { status: 400 });
    }

    const video = await YoutubeVideo.create(body);

    return NextResponse.json({ success: true, data: video }, { status: 201 });
  } catch (error) {
    const status = error.status || 400;
    console.error("Failed to create YouTube video:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create YouTube video.",
        error: error.message,
      },
      { status },
    );
  }
}
