import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import {
  createUserToken,
  isValidEmail,
  normalizeEmail,
  sanitizeUser,
  setUserAuthCookie,
} from "@/lib/userAuth";
import User from "@/models/User";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { email = "", password = "" } = await request.json();
    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail) || !String(password).trim()) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email: normalizedEmail, isActive: true }).select("+passwordHash");

    if (!user?.passwordHash) {
      return NextResponse.json(
        { success: false, message: "No password login is set for this account." },
        { status: 401 },
      );
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 },
      );
    }

    user.lastLoginAt = new Date();
    await user.save();

    const response = NextResponse.json({
      success: true,
      user: sanitizeUser(user),
    });

    setUserAuthCookie(response, createUserToken(user));

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Login failed.", error: error.message },
      { status: 500 },
    );
  }
}
