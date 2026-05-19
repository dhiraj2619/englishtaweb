import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/adminAuth";
import connectToDatabase from "@/lib/mongodb";
import Course from "@/models/Course";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const courseModes = ["live", "recorded", "audio", "progress"];
const batchTypes = ["beginners", "advanced", "speakers", "interview", "grammar", "super5", "oneOnOne"];
const languageTypes = ["marathi", "hindi", "english"];
const themeTypes = ["yellow", "orange", "purple", "blue", "green", "dark"];

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

function isYes(value) {
  return value === true || value === "true" || value === "Yes";
}

function validateCoursePayload(payload) {
  if (!payload.name?.trim() || !payload.thumbnail?.trim() || !payload.shortDescription?.trim() || !payload.longDescription?.trim()) {
    return "Please fill all required course fields.";
  }

  const courseMode = payload.courseMode?.trim().toLowerCase();
  if (courseMode && !courseModes.includes(courseMode)) {
    return "Please select a valid course mode.";
  }

  const batchType = payload.batchType?.trim().toLowerCase();
  if (batchType && !batchTypes.includes(batchType)) {
    return "Please select a valid batch type.";
  }

  const theme = payload.theme?.trim().toLowerCase();
  if (theme && !themeTypes.includes(theme)) {
    return "Please select a valid course theme.";
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
  const benefits = parseList(payload.benefits, ["Early Bird Offer", "Free Speaking Club", "Bonus PDFs", "WhatsApp Group"]);

  return {
    ...payload,
    courseMode: payload.courseMode?.trim().toLowerCase() || "live",
    batchType: payload.batchType?.trim().toLowerCase() || "beginners",
    cardTitle: payload.cardTitle?.trim() || payload.name?.trim() || "",
    cardSubtitle: payload.cardSubtitle?.trim() || payload.shortDescription?.trim() || "",
    languages: normalizedLanguages.length ? normalizedLanguages : ["marathi", "hindi", "english"],
    benefits,
    badge: payload.badge?.trim() || "",
    isPremium: isYes(payload.isPremium),
    sortOrder: Number.isFinite(Number(payload.sortOrder)) ? Number(payload.sortOrder) : 0,
    theme: payload.theme?.trim().toLowerCase() || "yellow",
    icon: payload.icon?.trim() || "",
    visible: payload.visible === "No" ? "No" : "Yes",
  };
}

export async function GET() {
  try {
    await connectToDatabase();
    await Course.collection.updateMany(
      {
        $or: [
          { courseMode: { $exists: false } },
          { batchType: { $exists: false } },
          { languages: { $exists: false } },
          { benefits: { $exists: false } },
          { theme: { $exists: false } },
          { visible: { $exists: false } },
        ],
      },
      [
        {
          $set: {
            courseMode: { $ifNull: ["$courseMode", "live"] },
            batchType: { $ifNull: ["$batchType", "beginners"] },
            languages: { $ifNull: ["$languages", ["marathi", "hindi", "english"]] },
            benefits: {
              $ifNull: ["$benefits", ["Early Bird Offer", "Free Speaking Club", "Bonus PDFs", "WhatsApp Group"]],
            },
            theme: { $ifNull: ["$theme", "yellow"] },
            visible: { $ifNull: ["$visible", "Yes"] },
          },
        },
      ],
    );
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
    await Course.collection.updateOne(
      { _id: course._id },
      {
        $set: {
          courseMode: normalizedBody.courseMode,
          batchType: normalizedBody.batchType,
          cardTitle: normalizedBody.cardTitle,
          cardSubtitle: normalizedBody.cardSubtitle,
          languages: normalizedBody.languages,
          benefits: normalizedBody.benefits,
          badge: normalizedBody.badge,
          isPremium: normalizedBody.isPremium,
          sortOrder: normalizedBody.sortOrder,
          theme: normalizedBody.theme,
          icon: normalizedBody.icon,
          visible: normalizedBody.visible,
        },
      },
    );

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
