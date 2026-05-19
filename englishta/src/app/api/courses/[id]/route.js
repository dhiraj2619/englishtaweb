import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/adminAuth";
import connectToDatabase from "@/lib/mongodb";
import Course from "@/models/Course";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const courseModes = ["live", "recorded", "audio", "progress"];
const languageTypes = ["marathi", "hindi", "english"];
const removedCourseFields = {
  batchType: "",
  cardTitle: "",
  cardSubtitle: "",
  benefits: "",
  badge: "",
  isPremium: "",
  sortOrder: "",
  theme: "",
  icon: "",
};

function parseList(value, fallback = []) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return fallback;
}

function validateCoursePayload(payload) {
  if (!payload.name?.trim() || !payload.thumbnail?.trim() || !payload.shortDescription?.trim() || !payload.longDescription?.trim()) {
    return "Please fill all required course fields.";
  }

  const courseMode = payload.courseMode?.trim().toLowerCase();
  if (courseMode && !courseModes.includes(courseMode)) {
    return "Please select a valid course mode.";
  }

  const languages = parseList(payload.languages);
  if (languages.some((language) => !languageTypes.includes(language.toLowerCase()))) {
    return "Please select valid course languages.";
  }

  return "";
}

function normalizeCoursePayload(payload) {
  const normalizedLanguages = parseList(payload.languages, ["marathi", "hindi", "english"]).map((language) =>
    language.toLowerCase(),
  );

  return {
    name: payload.name?.trim() || "",
    courseMode: payload.courseMode?.trim().toLowerCase() || "live",
    thumbnail: payload.thumbnail?.trim() || "",
    shortDescription: payload.shortDescription?.trim() || "",
    longDescription: payload.longDescription?.trim() || "",
    syllabus: payload.syllabus?.trim() || "",
    languages: normalizedLanguages.length ? normalizedLanguages : ["marathi", "hindi", "english"],
    allowBooking: payload.allowBooking === "No" ? "No" : "Yes",
    price: payload.price?.trim() || "",
    studentsEnrolled: payload.studentsEnrolled?.trim() || "",
    visible: payload.visible === "No" ? "No" : "Yes",
  };
}

export async function GET(_request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const course = await Course.findById(id).lean();

    if (!course) {
      return NextResponse.json({ success: false, message: "Course not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    console.error("Failed to fetch course:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch course.", error: error.message },
      { status: 400 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await requireAdminAccess();
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const errorMessage = validateCoursePayload(body);

    if (errorMessage) {
      return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
    }

    const normalizedBody = normalizeCoursePayload(body);
    const course = await Course.findByIdAndUpdate(id, normalizedBody, {
      new: true,
      runValidators: true,
    }).lean();

    if (!course) {
      return NextResponse.json({ success: false, message: "Course not found." }, { status: 404 });
    }

    await Course.collection.updateOne({ _id: course._id }, { $unset: removedCourseFields });

    return NextResponse.json({ success: true, data: { ...course, ...normalizedBody } });
  } catch (error) {
    const status = error.status || 400;
    console.error("Failed to update course:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update course.", error: error.message },
      { status },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    await requireAdminAccess();
    await connectToDatabase();
    const { id } = await params;
    const course = await Course.findByIdAndDelete(id).lean();

    if (!course) {
      return NextResponse.json({ success: false, message: "Course not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    const status = error.status || 400;
    console.error("Failed to delete course:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete course.", error: error.message },
      { status },
    );
  }
}
