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

async function exchangeGoogleCode(code, redirectUri) {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Google login is not configured yet. Please set GOOGLE_CLIENT_SECRET.");
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokenPayload = await tokenResponse.json();

  if (!tokenResponse.ok) {
    throw new Error(
      tokenPayload.error_description ||
        tokenPayload.error ||
        "Google authorization code exchange failed.",
    );
  }

  if (!tokenPayload.id_token) {
    throw new Error("Google login did not return an ID token.");
  }

  const verificationResponse = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(tokenPayload.id_token)}`,
  );

  if (!verificationResponse.ok) {
    throw new Error("Google verification failed.");
  }

  const profile = await verificationResponse.json();

  if (profile.aud !== clientId) {
    throw new Error("Google client mismatch.");
  }

  if (!profile.email) {
    throw new Error("Google account email is missing.");
  }

  if (profile.email_verified !== "true" && profile.email_verified !== true) {
    throw new Error("Google account email is not verified.");
  }

  return profile;
}

export async function POST(request) {
  try {
    if (request.headers.get("X-Requested-With") !== "XmlHttpRequest") {
      return NextResponse.json(
        { success: false, message: "Invalid Google login request." },
        { status: 403 },
      );
    }

    const { code = "" } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Google authorization code is required." },
        { status: 400 },
      );
    }

    const profile = await exchangeGoogleCode(code, request.nextUrl.origin);
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
      { success: false, message: error.message || "Google login failed." },
      { status: 401 },
    );
  }
}
