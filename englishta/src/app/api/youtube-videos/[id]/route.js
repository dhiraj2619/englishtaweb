import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import YoutubeVideo from "@/models/YoutubeVideo";

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
    return NextResponse.json(
      { success: false, message: "Failed to fetch YouTube video.", error: error.message },
      { status: 400 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const body = await request.json();
    const video = await YoutubeVideo.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!video) {
      return NextResponse.json({ success: false, message: "YouTube video not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: video });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update YouTube video.", error: error.message },
      { status: 400 },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const video = await YoutubeVideo.findByIdAndDelete(id).lean();

    if (!video) {
      return NextResponse.json({ success: false, message: "YouTube video not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: video });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete YouTube video.", error: error.message },
      { status: 400 },
    );
  }
}
