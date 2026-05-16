import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/adminAuth";
import connectToDatabase from "@/lib/mongodb";
import WebinarRegistration from "@/models/WebinarRegistration";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validateRegistrationPayload(payload) {
  const errors = [];

  if (!payload.webinarTitle?.trim()) errors.push("Webinar title is required.");
  if (!payload.firstName?.trim()) errors.push("First name is required.");
  if (!payload.lastName?.trim()) errors.push("Last name is required.");
  if (!payload.email?.trim()) errors.push("Email is required.");
  if (!payload.mobile?.trim()) errors.push("Mobile is required.");
  if (!payload.gender?.trim()) errors.push("Gender is required.");
  if (!payload.occupation?.trim()) errors.push("Occupation is required.");
  if (payload.occupation === "student" && !payload.standard?.trim()) errors.push("Standard is required.");
  if (!payload.city?.trim()) errors.push("City is required.");
  if (!payload.state?.trim()) errors.push("State is required.");

  return errors;
}

export async function GET() {
  try {
    await requireAdminAccess();
    await connectToDatabase();

    const registrations = await WebinarRegistration.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: registrations });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json(
      { success: false, message: "Failed to fetch webinar registrations.", error: error.message },
      { status },
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const errors = validateRegistrationPayload(body);

    if (errors.length) {
      return NextResponse.json({ success: false, message: errors[0] }, { status: 400 });
    }

    const registration = await WebinarRegistration.create({
      webinarTitle: body.webinarTitle.trim(),
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: body.email.trim().toLowerCase(),
      mobile: body.mobile.trim(),
      gender: body.gender.trim().toLowerCase(),
      occupation: body.occupation.trim().toLowerCase(),
      standard: body.occupation === "student" ? body.standard?.trim() || "" : "",
      city: body.city.trim(),
      state: body.state.trim(),
    });

    return NextResponse.json({ success: true, data: registration }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to save webinar registration.", error: error.message },
      { status: 500 },
    );
  }
}
