import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/adminAuth";
import connectToDatabase from "@/lib/mongodb";
import SkillCheckTest from "@/models/SkillCheckTest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeTestPayload(body) {
  const questions = Array.isArray(body.questions)
    ? body.questions.map((question) => ({
        question: String(question.question || "").trim(),
        category: question.category || "vocabulary",
        options: Array.isArray(question.options)
          ? question.options.map((option) => String(option || "").trim()).filter(Boolean)
          : [],
        correctOptionIndex: Number(question.correctOptionIndex ?? 0),
        marks: Number(question.marks || 1),
      }))
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

  if (!payload.questions.length) {
    return "Please add at least one question.";
  }

  const invalidQuestionIndex = payload.questions.findIndex((question) => {
    const correctOption = question.options[question.correctOptionIndex];

    return (
      !question.question ||
      question.options.length < 2 ||
      !correctOption ||
      !Number.isInteger(question.correctOptionIndex) ||
      question.correctOptionIndex < 0 ||
      question.correctOptionIndex >= question.options.length ||
      !Number.isFinite(question.marks) ||
      question.marks < 1
    );
  });

  if (invalidQuestionIndex >= 0) {
    return `Please complete question ${invalidQuestionIndex + 1}, its options, correct answer, and marks.`;
  }

  if (!Number.isFinite(payload.timeLimitMinutes) || payload.timeLimitMinutes < 1) {
    return "Time limit must be at least 1 minute.";
  }

  if (!Number.isFinite(payload.passingScore) || payload.passingScore < 0) {
    return "Passing score cannot be negative.";
  }

  return "";
}

export async function PUT(request, { params }) {
  try {
    await requireAdminAccess();
    await connectToDatabase();

    const { id } = await params;
    const body = await request.json();
    const payload = normalizeTestPayload(body);
    const validationMessage = validateTestPayload(payload);

    if (validationMessage) {
      return NextResponse.json({ success: false, message: validationMessage }, { status: 400 });
    }

    const existingSet = await SkillCheckTest.findOne({
      setCode: payload.setCode,
      _id: { $ne: id },
    }).lean();

    if (existingSet) {
      return NextResponse.json(
        { success: false, message: `Test set ${payload.setCode} already exists. Please edit it or choose another set.` },
        { status: 409 },
      );
    }

    const test = await SkillCheckTest.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).lean();

    if (!test) {
      return NextResponse.json({ success: false, message: "Skill check test not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: test });
  } catch (error) {
    const status = error.status || 500;

    return NextResponse.json(
      { success: false, message: "Failed to update skill check test.", error: error.message },
      { status },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    await requireAdminAccess();
    await connectToDatabase();

    const { id } = await params;
    const test = await SkillCheckTest.findByIdAndDelete(id).lean();

    if (!test) {
      return NextResponse.json({ success: false, message: "Skill check test not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: test });
  } catch (error) {
    const status = error.status || 500;

    return NextResponse.json(
      { success: false, message: "Failed to delete skill check test.", error: error.message },
      { status },
    );
  }
}
