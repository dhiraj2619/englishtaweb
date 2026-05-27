import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import { getUserTokenPayload, sanitizeUser } from "@/lib/userAuth";
import User from "@/models/User";

export const runtime = "nodejs";

export async function GET() {
  try {
    const payload = await getUserTokenPayload();

    if (!payload?.sub) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findOne({ _id: payload.sub, isActive: true });

    if (!user) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Unable to load user.", error: error.message },
      { status: 500 },
    );
  }
}
