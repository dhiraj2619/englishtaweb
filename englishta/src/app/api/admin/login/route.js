import { NextResponse } from "next/server";

import { ADMIN_COOKIE_NAME, getAdminSessionValue, validateAdminCredentials } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { email = "", password = "" } = await request.json();

    if (!email.trim() || !password.trim()) {
      return NextResponse.json({ success: false, message: "Email and password are required." }, { status: 400 });
    }

    if (!validateAdminCredentials(email.trim(), password)) {
      return NextResponse.json({ success: false, message: "Invalid admin credentials." }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE_NAME, getAdminSessionValue(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, message: "Login failed.", error: error.message }, { status: 500 });
  }
}
