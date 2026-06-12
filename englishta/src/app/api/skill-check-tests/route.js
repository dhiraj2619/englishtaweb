import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/adminAuth";
import connectToDatabase from "@/lib/mongodb";
import SkillCheckTest from "@/models/SkillCheckTest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeTestPayload(body) {
  const questions = Array.isArray(body.questions)
    ? body.questions.map((question) => {
        const options = Array.isArray(question.options)
          ? question.options.map((option) => String(option || "").trim()).filter(Boolean).slice(0, 3)
          : [];
        const optionScores = Array.isArray(question.optionScores)
          ? question.optionScores.slice(0, 3).map((score, index) => {
              const normalizedScore = Number(score);
              return [1, 2, 3].includes(normalizedScore) ? normalizedScore : index + 1;
            })
          : [1, 2, 3];

        return {
          question: String(question.question || "").trim(),
          category: question.category || "vocabulary",
          options,
          optionScores,
          correctOptionIndex: 2,
          marks: 3,
        };
      })
    : [];

  return {
    setCode: String(body.setCode || "A").trim().toUpperCase(),
    title: String(body.title || "").trim(),
    description: String(body.description || "").trim(),
    timeLimitMinutes: Number(body.timeLimitMinutes || 15),
    passingScore: Number(body.passingScore || 0),
    visible: body.visible === "No" ? "No" : "Yes",
    questions,
  };
}

function validateTestPayload(payload) {
  if (!["A", "B", "C", "D"].includes(payload.setCode)) {
    return "Please select a valid test set.";
  }

  if (!payload.title) {
    return "Test title is required.";
  }

  if (payload.questions.length !== 5) {
    return "Please add exactly 5 questions. Each set is out of 15 marks.";
  }

  const invalidQuestionIndex = payload.questions.findIndex((question) => {
    return (
      !question.question ||
      question.options.length !== 3 ||
      !Array.isArray(question.optionScores) ||
      question.optionScores.length !== 3 ||
      question.optionScores.some((score) => ![1, 2, 3].includes(Number(score)))
    );
  });

  if (invalidQuestionIndex >= 0) {
    return `Please complete question ${invalidQuestionIndex + 1} with exactly 3 options and scores from 1 to 3.`;
  }

  if (!Number.isFinite(payload.timeLimitMinutes) || payload.timeLimitMinutes < 1) {
    return "Time limit must be at least 1 minute.";
  }

  if (!Number.isFinite(payload.passingScore) || payload.passingScore < 0) {
    return "Passing score cannot be negative.";
  }

  return "";
}

export async function GET() {
  try {
    await requireAdminAccess();
    await connectToDatabase();

    const tests = await SkillCheckTest.find().sort({ setCode: 1, createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: tests });
  } catch (error) {
    const status = error.status || 500;

    return NextResponse.json(
      { success: false, message: "Failed to load skill check tests.", error: error.message },
      { status },
    );
  }
}

export async function POST(request) {
  try {
    await requireAdminAccess();
    await connectToDatabase();

    const body = await request.json();
    const payload = normalizeTestPayload(body);
    const validationMessage = validateTestPayload(payload);

    if (validationMessage) {
      return NextResponse.json({ success: false, message: validationMessage }, { status: 400 });
    }

    const existingSet = await SkillCheckTest.findOne({ setCode: payload.setCode }).lean();

    if (existingSet) {
      return NextResponse.json(
        { success: false, message: `Test set ${payload.setCode} already exists. Please edit it or choose another set.` },
        { status: 409 },
      );
    }

    const test = await SkillCheckTest.create(payload);

    return NextResponse.json({ success: true, data: test }, { status: 201 });
  } catch (error) {
    const status = error.status || 500;

    return NextResponse.json(
      { success: false, message: "Failed to create skill check test.", error: error.message },
      { status },
    );
  }
}
