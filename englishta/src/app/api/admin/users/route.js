import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/adminAuth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdminAccess();
    await connectToDatabase();

    const users = await User.find({ isActive: true })
      .select("name email phone authProvider avatarUrl createdAt lastLoginAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    const status = error.status || 500;

    return NextResponse.json(
      { success: false, message: "Failed to load users.", error: error.message },
      { status },
    );
  }
}
