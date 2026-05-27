import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import {
  isValidEmail,
  normalizeEmail,
  sanitizeUser,
} from "@/lib/userAuth";
import User from "@/models/User";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { email = "", password = "", name = "", phone = "" } = await request.json();
    const normalizedEmail = normalizeEmail(email);
    const cleanName = String(name || "").trim();
    const cleanPhone = String(phone || "").trim();

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (cleanName.length < 2) {
      return NextResponse.json(
        { success: false, message: "Please enter your full name." },
        { status: 400 },
      );
    }

    if (!/^[0-9+\-\s()]{7,18}$/.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid phone number." },
        { status: 400 },
      );
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters." },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email: normalizedEmail }).select("_id").lean();

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "An account already exists for this email." },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: cleanName,
      email: normalizedEmail,
      phone: cleanPhone,
      passwordHash,
      authProvider: "credentials",
      lastLoginAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      user: sanitizeUser(user),
      message: "Account created successfully. Please login to continue.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Registration failed.", error: error.message },
      { status: 500 },
    );
  }
}
