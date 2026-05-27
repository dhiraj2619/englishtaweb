import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import { isValidEmail, normalizeEmail } from "@/lib/userAuth";
import User from "@/models/User";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { email = "" } = await request.json();
    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email: normalizedEmail }).select("_id authProvider").lean();

    return NextResponse.json({
      success: true,
      exists: Boolean(user),
      authProvider: user?.authProvider || null,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Unable to check email.", error: error.message },
      { status: 500 },
    );
  }
}
