import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import { getUserTokenPayload, sanitizeUser } from "@/lib/userAuth";
import SkillCheckAttempt from "@/models/SkillCheckAttempt";
import SkillCheckTest from "@/models/SkillCheckTest";
import User from "@/models/User";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getResultLevel(score, totalMarks) {
  const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;

  if (percentage >= 75) return "advanced";
  if (percentage >= 45) return "intermediate";
  return "beginner";
}

function normalizeAnswers(value) {
  return Array.isArray(value)
    ? value.map((answer) => ({
        questionId: String(answer.questionId || "").trim(),
        selectedOptionIndex: Number(answer.selectedOptionIndex),
      }))
    : [];
}

export async function POST(request) {
  try {
    const tokenPayload = await getUserTokenPayload();

    if (!tokenPayload?.sub) {
      return NextResponse.json({ success: false, message: "Please login to submit the skill test." }, { status: 401 });
    }

    await connectToDatabase();

    const body = await request.json();
    const testId = String(body.testId || "").trim();
    const answers = normalizeAnswers(body.answers);
    const warningCount = Math.max(0, Number(body.warningCount || 0));

    if (!testId || !answers.length) {
      return NextResponse.json({ success: false, message: "Please answer the test before submitting." }, { status: 400 });
    }

    const [test, user] = await Promise.all([
      SkillCheckTest.findOne({ _id: testId, visible: "Yes" }),
      User.findOne({ _id: tokenPayload.sub, isActive: true }),
    ]);

    if (!test) {
      return NextResponse.json({ success: false, message: "Skill test not found." }, { status: 404 });
    }

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 401 });
    }

    const answerMap = new Map(answers.map((answer) => [answer.questionId, answer.selectedOptionIndex]));
    const categoryScores = {
      speaking: 0,
      vocabulary: 0,
      confidence: 0,
      grammar: 0,
    };
    let score = 0;
    let totalMarks = 0;

    const checkedAnswers = test.questions.map((question) => {
      const questionId = String(question._id);
      const selectedOptionIndex = answerMap.get(questionId);
      const marks = Number(question.marks || 1);
      const correct = Number(selectedOptionIndex) === Number(question.correctOptionIndex);
      const marksAwarded = correct ? marks : 0;

      totalMarks += marks;
      score += marksAwarded;

      if (categoryScores[question.category] !== undefined) {
        categoryScores[question.category] += marksAwarded;
      }

      return {
        questionId: question._id,
        selectedOptionIndex: Number.isFinite(selectedOptionIndex) ? selectedOptionIndex : -1,
        correct,
        marksAwarded,
      };
    });

    const resultLevel = getResultLevel(score, totalMarks);

    await SkillCheckAttempt.create({
      userId: user._id,
      testId: test._id,
      answers: checkedAnswers,
      score,
      totalMarks,
      speakingScore: categoryScores.speaking,
      vocabularyScore: categoryScores.vocabulary,
      confidenceScore: categoryScores.confidence,
      grammarScore: categoryScores.grammar,
      resultLevel,
      warningCount,
      completedAt: new Date(),
    });

    user.skillTestCompleted = true;
    user.skillTestScore = score;
    user.speakingScore = categoryScores.speaking;
    user.vocabularyScore = categoryScores.vocabulary;
    user.confidenceScore = categoryScores.confidence;
    user.englishLevel = resultLevel;
    user.totalTestsCompleted = (user.totalTestsCompleted || 0) + 1;
    await user.save();

    return NextResponse.json({
      success: true,
      data: {
        score,
        totalMarks,
        speakingScore: categoryScores.speaking,
        vocabularyScore: categoryScores.vocabulary,
        confidenceScore: categoryScores.confidence,
        grammarScore: categoryScores.grammar,
        resultLevel,
      },
      user: sanitizeUser(user),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to submit skill test.", error: error.message },
      { status: 500 },
    );
  }
}
