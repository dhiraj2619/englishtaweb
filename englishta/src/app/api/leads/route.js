import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/adminAuth";
import connectToDatabase from "@/lib/mongodb";
import Lead from "@/models/Lead";
import WebinarRegistration from "@/models/WebinarRegistration";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validateLeadPayload(payload) {
  const errors = [];
  const source = payload.source?.trim();
  const email = payload.email?.trim();
  const phone = (payload.mobile || payload.phone || "").trim();

  if (!source) errors.push("Source is required.");
  if (!email) errors.push("Email is required.");
  if (!phone) errors.push("Mobile or phone is required.");

  if (source === "Course Inquiry" && !payload.name?.trim()) {
    errors.push("Name is required for course inquiry.");
  }

  if (source === "Webinar Registration") {
    if (!payload.firstName?.trim()) errors.push("First name is required.");
    if (!payload.lastName?.trim()) errors.push("Last name is required.");
    if (!payload.gender?.trim()) errors.push("Gender is required.");
    if (!payload.occupation?.trim()) errors.push("Occupation is required.");
    if (payload.occupation === "student" && !payload.standard?.trim()) errors.push("Standard is required.");
    if (!payload.city?.trim()) errors.push("City is required.");
    if (!payload.state?.trim()) errors.push("State is required.");
  }

  return errors;
}

export async function GET() {
  try {
    await requireAdminAccess();
    await connectToDatabase();
    const [courseInquiries, webinarRegistrations] = await Promise.all([
      Lead.find({ source: "Course Inquiry" }).lean(),
      WebinarRegistration.find().lean(),
    ]);

    const registrations = webinarRegistrations.map((item) => ({
      ...item,
      name: `${item.firstName || ""} ${item.lastName || ""}`.trim(),
      phone: item.mobile || "",
      source: "Webinar Registration",
      course: item.webinarTitle || "",
    }));

    const leads = [...courseInquiries, ...registrations].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return NextResponse.json({ success: true, data: leads });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ success: false, message: "Failed to fetch leads.", error: error.message }, { status });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const errors = validateLeadPayload(body);

    if (errors.length) {
      return NextResponse.json({ success: false, message: errors[0] }, { status: 400 });
    }

    const lead = await Lead.create({
      ...body,
      email: body.email.trim().toLowerCase(),
      phone: (body.phone || body.mobile || "").trim(),
      mobile: (body.mobile || body.phone || "").trim(),
      name: body.name?.trim() || `${body.firstName?.trim() || ""} ${body.lastName?.trim() || ""}`.trim(),
    });

    return NextResponse.json({ success: true, data: lead }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to save lead.", error: error.message }, { status: 500 });
  }
}
