import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectToDatabase from "@/lib/mongodb";
import Course from "@/models/Course";
import YoutubeVideo from "@/models/YoutubeVideo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const getMongoHost = () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) return "";
    return new URL(uri).host;
  } catch {
    return "Invalid MongoDB URI format";
  }
};

export async function GET() {
  const diagnostics = {
    env: {
      mongodbUriPresent: Boolean(process.env.MONGODB_URI),
      mongodbDbPresent: Boolean(process.env.MONGODB_DB),
      mongodbDb: process.env.MONGODB_DB || "",
      mongodbHost: getMongoHost(),
    },
    mongooseReadyState: mongoose.connection.readyState,
    counts: null,
  };

  try {
    await connectToDatabase();

    const [courses, videos] = await Promise.all([
      Course.countDocuments(),
      YoutubeVideo.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      message: "Database connection is working.",
      diagnostics: {
        ...diagnostics,
        mongooseReadyState: mongoose.connection.readyState,
        counts: { courses, videos },
      },
    });
  } catch (error) {
    console.error("Database diagnostics failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed.",
        diagnostics: {
          ...diagnostics,
          mongooseReadyState: mongoose.connection.readyState,
          error: {
            name: error.name,
            message: error.message,
          },
        },
      },
      { status: 500 },
    );
  }
}
