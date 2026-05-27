import { NextResponse } from "next/server";

import { clearUserAuthCookie } from "@/lib/userAuth";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ success: true });
  clearUserAuthCookie(response);
  return response;
}
