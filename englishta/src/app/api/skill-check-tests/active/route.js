import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import { getUserTokenPayload } from "@/lib/userAuth";
import SkillCheckTest from "@/models/SkillCheckTest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sanitizeTest(test) {
  return {
    _id: String(test._id),
    setCode: test.setCode,
    title: test.title,
    description: test.description || "",
    timeLimitMinutes: test.timeLimitMinutes || 15,
    passingScore: test.passingScore || 0,
    questions: (test.questions || []).map((question) => ({
      _id: String(question._id),
      question: question.question,
      category: question.category,
      options: question.options,
      optionScores: Array.isArray(question.optionScores) && question.optionScores.length
        ? question.optionScores
        : question.options.map((_option, index) => index + 1),
      marks: Math.max(...(Array.isArray(question.optionScores) && question.optionScores.length
        ? question.optionScores
        : question.options.map((_option, index) => index + 1))),
    })),
  };
}

export async function GET() {
  try {
    const payload = await getUserTokenPayload();

    if (!payload?.sub) {
      return NextResponse.json({ success: false, message: "Please login to take the skill test." }, { status: 401 });
    }

    await connectToDatabase();

    const test = await SkillCheckTest.findOne({ visible: "Yes" }).sort({ setCode: 1, createdAt: -1 }).lean();

    if (!test) {
      return NextResponse.json({ success: false, message: "No active skill test is available right now." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: sanitizeTest(test) });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to load skill test.", error: error.message },
      { status: 500 },
    );
  }
}
