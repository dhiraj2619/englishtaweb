import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/adminAuth";
import connectToDatabase from "@/lib/mongodb";
import CourseLead from "@/models/CourseLead";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const preferredLanguages = ["english", "hindi", "marathi"];

function validateCourseLeadPayload(payload) {
  const errors = [];
  const preferredLanguage = payload.preferredLanguage?.trim().toLowerCase();

  if (!payload.courseName?.trim()) errors.push("Course name is required.");
  if (!payload.firstName?.trim()) errors.push("First name is required.");
  if (!payload.lastName?.trim()) errors.push("Last name is required.");
  if (!payload.email?.trim()) errors.push("Email is required.");
  if (!payload.mobile?.trim()) errors.push("Mobile is required.");
  if (!payload.gender?.trim()) errors.push("Gender is required.");
  if (!payload.occupation?.trim()) errors.push("Occupation is required.");
  if (!payload.preferredLanguage?.trim())
    errors.push("Preferred language is required.");
  if (preferredLanguage && !preferredLanguages.includes(preferredLanguage)) {
    errors.push("Please select a valid preferred language.");
  }
  if (payload.occupation === "student" && !payload.standard?.trim())
    errors.push("Standard is required.");
  if (!payload.city?.trim()) errors.push("City is required.");
  if (!payload.state?.trim()) errors.push("State is required.");

  return errors;
}

export async function GET() {
  try {
    await requireAdminAccess();
    await connectToDatabase();

    const leads = await CourseLead.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: leads });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch course leads.",
        error: error.message,
      },
      { status },
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const errors = validateCourseLeadPayload(body);

    if (errors.length) {
      return NextResponse.json(
        { success: false, message: errors[0] },
        { status: 400 },
      );
    }

    const lead = await CourseLead.create({
      courseName: body.courseName.trim(),
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: body.email.trim().toLowerCase(),
      mobile: body.mobile.trim(),
      gender: body.gender.trim().toLowerCase(),
      occupation: body.occupation.trim().toLowerCase(),
      preferredLanguage: body.preferredLanguage.trim().toLowerCase(),
      standard:
        body.occupation === "student" ? body.standard?.trim() || "" : "",
      city: body.city.trim(),
      state: body.state.trim(),
      message: body.message?.trim() || "",
    });

    return NextResponse.json({ success: true, data: lead }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save course lead.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
