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

async function cleanLegacyCourseFields() {
  await Course.collection.updateMany(
    {
      $or: [
        { courseMode: { $exists: false } },
        { languages: { $exists: false } },
        { visible: { $exists: false } },
      ],
    },
    [
      {
        $set: {
          courseMode: { $ifNull: ["$courseMode", "live"] },
          languages: { $ifNull: ["$languages", ["marathi", "hindi", "english"]] },
          visible: { $ifNull: ["$visible", "Yes"] },
        },
      },
    ],
  );

  await Course.collection.updateMany({}, { $unset: removedCourseFields });
}

export async function GET() {
  try {
    await connectToDatabase();
    await cleanLegacyCourseFields();
    const courses = await Course.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    console.error("Failed to fetch courses:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch courses.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    await requireAdminAccess();
    await connectToDatabase();
    const body = await request.json();
    const errorMessage = validateCoursePayload(body);

    if (errorMessage) {
      return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
    }

    const normalizedBody = normalizeCoursePayload(body);
    const course = await Course.create(normalizedBody);
    await Course.collection.updateOne({ _id: course._id }, { $unset: removedCourseFields });

    return NextResponse.json(
      { success: true, data: { ...course.toObject(), ...normalizedBody } },
      { status: 201 },
    );
  } catch (error) {
    const status = error.status || 400;
    console.error("Failed to create course:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create course.",
        error: error.message,
      },
      { status },
    );
  }
}
