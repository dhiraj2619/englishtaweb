import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import {
  createUserToken,
  normalizeEmail,
  sanitizeUser,
  setUserAuthCookie,
} from "@/lib/userAuth";
import User from "@/models/User";

export const runtime = "nodejs";

async function verifyGoogleCredential(credential) {
  const response = await fetch("https://oauth2.googleapis.com/tokeninfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ id_token: credential }),
  });

  if (!response.ok) {
    throw new Error("Google verification failed.");
  }

  const profile = await response.json();
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (clientId && profile.aud !== clientId) {
    throw new Error("Google client mismatch.");
  }

  if (!profile.email) {
    throw new Error("Google account email is missing.");
  }

  return profile;
}

export async function POST(request) {
  try {
    const { credential = "" } = await request.json();

    if (!credential) {
      return NextResponse.json(
        { success: false, message: "Google credential is required." },
        { status: 400 },
      );
    }

    const profile = await verifyGoogleCredential(credential);
    const email = normalizeEmail(profile.email);

    await connectToDatabase();

    let user = await User.findOne({ email }).select("+passwordHash");

    if (!user) {
      user = await User.create({
        name: profile.name || "",
        email,
        googleId: profile.sub || "",
        avatarUrl: profile.picture || "",
        authProvider: "google",
        lastLoginAt: new Date(),
      });
    } else {
      user.name = user.name || profile.name || "";
      user.googleId = user.googleId || profile.sub || "";
      user.avatarUrl = profile.picture || user.avatarUrl || "";
      user.authProvider = user.passwordHash ? "mixed" : "google";
      user.lastLoginAt = new Date();
      await user.save();
    }

    const response = NextResponse.json({
      success: true,
      user: sanitizeUser(user),
    });

    setUserAuthCookie(response, createUserToken(user));

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Google login failed.", error: error.message },
      { status: 401 },
    );
  }
}
