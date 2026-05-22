import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/adminAuth";
import connectToDatabase from "@/lib/mongodb";
import DemoLectureVideo from "@/models/DemoLectureVideo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validateDemoLecturePayload(payload) {
  if (!(payload.youtubeEmbedCode || payload.youtubeIframe || payload.youtubeUrl)?.trim()) {
    return "YouTube embed code is required.";
  }

  if (!payload.thumbnail?.trim()) {
    return "Thumbnail is required.";
  }

  return null;
}

function normalizeDemoLecturePayload(payload) {
  const youtubeEmbedCode = (payload.youtubeEmbedCode || payload.youtubeIframe || payload.youtubeUrl)?.trim() || "";

  return {
    youtubeEmbedCode,
    youtubeIframe: youtubeEmbedCode,
    youtubeUrl: payload.youtubeUrl?.trim() || "",
    thumbnail: payload.thumbnail?.trim() || "",
  };
}

function normalizeDemoLectureDocument(video) {
  return {
    ...video,
    youtubeEmbedCode: video.youtubeEmbedCode || video.youtubeIframe || video.youtubeUrl || "",
    youtubeIframe: video.youtubeIframe || video.youtubeEmbedCode || video.youtubeUrl || "",
    youtubeUrl: video.youtubeUrl || "",
  };
}

export async function GET() {
  try {
    await connectToDatabase();
    const videos = await DemoLectureVideo.find().sort({ createdAt: -1 }).lean();
    const normalizedVideos = videos.map(normalizeDemoLectureDocument);

    return NextResponse.json({ success: true, data: normalizedVideos });
  } catch (error) {
    console.error("Failed to fetch demo lecture video:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch demo lecture video.",
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

    const existingVideo = await DemoLectureVideo.findOne().lean();

    if (existingVideo) {
      return NextResponse.json(
        { success: false, message: "Only one demo lecture video is allowed. Please edit the existing record." },
        { status: 409 },
      );
    }

    const body = await request.json();
    const errorMessage = validateDemoLecturePayload(body);

    if (errorMessage) {
      return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
    }

    const video = await DemoLectureVideo.create(normalizeDemoLecturePayload(body));

    return NextResponse.json({ success: true, data: video }, { status: 201 });
  } catch (error) {
    const status = error.status || 400;
    console.error("Failed to create demo lecture video:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create demo lecture video.",
        error: error.message,
      },
      { status },
    );
  }
}
