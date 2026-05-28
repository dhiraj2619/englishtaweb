import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import { getUserTokenPayload, sanitizeUser } from "@/lib/userAuth";
import User from "@/models/User";

export const runtime = "nodejs";

function normalizeOptionalText(value) {
  return String(value || "").trim();
}

function parseOptionalDate(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isTruthyValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value);
}

function calculateProfileCompletion(user) {
  const personalFields = [
    user.gender,
    user.dateOfBirth,
    user.city,
    user.state,
    user.profession,
  ];

  const learningFields = [
    user.englishLevel,
    user.learningGoal,
    user.dailyPracticeGoalMinutes,
    user.preferredLanguage,
  ];

  const skillFields = [
    user.skillTestCompleted,
    user.skillTestScore,
    user.speakingScore,
    user.vocabularyScore,
    user.confidenceScore,
  ];

  const courseFields = [
    user.recommendedCourse,
    user.recommendationGenerated,
    user.joinedCourses,
  ];

  const sections = [
    {
      fields: personalFields,
      weight: 40,
    },
    {
      fields: learningFields,
      weight: 20,
    },
    {
      fields: skillFields,
      weight: 20,
    },
    {
      fields: courseFields,
      weight: 20,
    },
  ];

  const completedWeight = sections.reduce((sum, section) => {
    const filledCount = section.fields.filter(isTruthyValue).length;
    const percent = Math.round((filledCount / section.fields.length) * 100);
    return sum + (percent / 100) * section.weight;
  }, 0);

  return Math.max(0, Math.min(100, Math.round(completedWeight)));
}

export async function PATCH(request) {
  try {
    const payload = await getUserTokenPayload();

    if (!payload?.sub) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();

    await connectToDatabase();

    const user = await User.findOne({ _id: payload.sub, isActive: true }).select("+passwordHash");

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }

    if (Object.prototype.hasOwnProperty.call(body, "gender")) {
      user.gender = normalizeOptionalText(body.gender).toLowerCase();
    }

    if (Object.prototype.hasOwnProperty.call(body, "dateOfBirth")) {
      user.dateOfBirth = parseOptionalDate(body.dateOfBirth);
    }

    if (Object.prototype.hasOwnProperty.call(body, "city")) {
      user.city = normalizeOptionalText(body.city);
    }

    if (Object.prototype.hasOwnProperty.call(body, "state")) {
      user.state = normalizeOptionalText(body.state);
    }

    if (Object.prototype.hasOwnProperty.call(body, "profession")) {
      user.profession = normalizeOptionalText(body.profession);
    }

    if (Object.prototype.hasOwnProperty.call(body, "englishLevel")) {
      user.englishLevel = normalizeOptionalText(body.englishLevel).toLowerCase();
    }

    if (Object.prototype.hasOwnProperty.call(body, "learningGoal")) {
      user.learningGoal = normalizeOptionalText(body.learningGoal).toLowerCase();
    }

    if (Object.prototype.hasOwnProperty.call(body, "dailyPracticeGoalMinutes")) {
      const parsed = Number.parseInt(body.dailyPracticeGoalMinutes, 10);
      if (Number.isFinite(parsed)) {
        user.dailyPracticeGoalMinutes = Math.max(5, Math.min(240, parsed));
      }
    }

    if (Object.prototype.hasOwnProperty.call(body, "preferredLanguage")) {
      user.preferredLanguage = normalizeOptionalText(body.preferredLanguage).toLowerCase() || "english";
    }

  user.profileCompletionPercentage = calculateProfileCompletion(user);
  user.onboardingCompleted = Boolean(
      user.gender &&
        user.dateOfBirth &&
        user.city &&
        user.state &&
        user.profession,
  );

    await user.save();

    return NextResponse.json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Unable to update profile.", error: error.message },
      { status: 500 },
    );
  }
}
