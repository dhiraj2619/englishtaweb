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

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const video = await DemoLectureVideo.findById(id).lean();

    if (!video) {
      return NextResponse.json({ success: false, message: "Demo lecture video not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: normalizeDemoLectureDocument(video) });
  } catch (error) {
    console.error("Failed to fetch demo lecture video:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch demo lecture video.", error: error.message },
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
    const errorMessage = validateDemoLecturePayload(body);

    if (errorMessage) {
      return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
    }

    const video = await DemoLectureVideo.findByIdAndUpdate(id, normalizeDemoLecturePayload(body), {
      new: true,
      runValidators: true,
    }).lean();

    if (!video) {
      return NextResponse.json({ success: false, message: "Demo lecture video not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: normalizeDemoLectureDocument(video) });
  } catch (error) {
    const status = error.status || 400;
    console.error("Failed to update demo lecture video:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Failed to update demo lecture video.", error: error.message },
      { status },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    await requireAdminAccess();
    await connectToDatabase();
    const video = await DemoLectureVideo.findByIdAndDelete(id).lean();

    if (!video) {
      return NextResponse.json({ success: false, message: "Demo lecture video not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: video });
  } catch (error) {
    const status = error.status || 400;
    console.error("Failed to delete demo lecture video:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete demo lecture video.", error: error.message },
      { status },
    );
  }
}
