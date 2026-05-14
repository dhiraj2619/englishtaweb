import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import YoutubeVideo from "@/models/YoutubeVideo";

export async function GET() {
  try {
    await connectToDatabase();
    const videos = await YoutubeVideo.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: videos });
  } catch (error) {
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
    await connectToDatabase();
    const body = await request.json();
    const video = await YoutubeVideo.create(body);

    return NextResponse.json({ success: true, data: video }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create YouTube video.",
        error: error.message,
      },
      { status: 400 },
    );
  }
}
