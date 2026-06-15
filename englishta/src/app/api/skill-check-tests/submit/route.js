import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import { getUserTokenPayload, sanitizeUser } from "@/lib/userAuth";
import SkillCheckAttempt from "@/models/SkillCheckAttempt";
import SkillCheckTest from "@/models/SkillCheckTest";
import User from "@/models/User";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getPercentageScore(score, totalMarks) {
  return totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
}

function getResultLevel(score) {
  return score <= 10 ? "beginner" : "intermediate";
}

function getResultLabel(percentageScore) {
  if (percentageScore >= 85) return "Excellent";
  if (percentageScore >= 70) return "Good";
  if (percentageScore >= 50) return "Average";
  return "Improving";
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
    let score = 0;
    let totalMarks = 0;

    const checkedAnswers = test.questions.map((question) => {
      const questionId = String(question._id);
      const selectedOptionIndex = answerMap.get(questionId);
      const optionScores =
        Array.isArray(question.optionScores) && question.optionScores.length
          ? question.optionScores.map(Number)
          : (question.options || []).map((_option, index) => index + 1);
      const marks = optionScores.length ? Math.max(...optionScores) : Number(question.marks || 1);
      const selectedScore = optionScores[Number(selectedOptionIndex)] || 0;
      const marksAwarded = Number.isFinite(selectedScore) ? selectedScore : 0;
      const correct = marksAwarded === marks;

      totalMarks += marks;
      score += marksAwarded;

      return {
        questionId: question._id,
        selectedOptionIndex: Number.isFinite(selectedOptionIndex) ? selectedOptionIndex : -1,
        correct,
        marksAwarded,
      };
    });

    const percentageScore = getPercentageScore(score, totalMarks);
    const resultLevel = getResultLevel(score);
    const resultLabel = getResultLabel(percentageScore);

    await SkillCheckAttempt.create({
      userId: user._id,
      testId: test._id,
      answers: checkedAnswers,
      score,
      totalMarks,
      speakingScore: percentageScore,
      vocabularyScore: percentageScore,
      confidenceScore: percentageScore,
      grammarScore: percentageScore,
      resultLevel,
      warningCount,
      completedAt: new Date(),
    });

    user.skillTestCompleted = true;
    user.skillTestScore = score;
    user.speakingScore = percentageScore;
    user.vocabularyScore = percentageScore;
    user.confidenceScore = percentageScore;
    user.englishLevel = resultLevel;
    user.recommendationGenerated = true;
    user.totalTestsCompleted = (user.totalTestsCompleted || 0) + 1;
    user.averageScore = percentageScore;
    user.overallProgress = Math.max(user.overallProgress || 0, percentageScore);
    user.skillProgress = {
      speakingConfidence: Math.max(user.skillProgress?.speakingConfidence || 0, percentageScore),
      vocabulary: Math.max(user.skillProgress?.vocabulary || 0, percentageScore),
      grammar: Math.max(user.skillProgress?.grammar || 0, percentageScore),
      communication: Math.max(user.skillProgress?.communication || 0, percentageScore),
    };
    user.weeklyChallenge = {
      ...(user.weeklyChallenge?.toObject?.() || user.weeklyChallenge || {}),
      completedCount: Math.min(3, (user.weeklyChallenge?.completedCount || 0) + 1),
    };
    user.scoreHistory = [
      ...(Array.isArray(user.scoreHistory) ? user.scoreHistory.slice(-3) : []),
      { label: `Test ${user.totalTestsCompleted}`, score: percentageScore },
    ];
    user.recentTestHistory = [
      {
        date: new Date(),
        testName: test.title,
        type: "Skill Check",
        score,
        totalScore: totalMarks,
        result: resultLabel,
      },
      ...(Array.isArray(user.recentTestHistory) ? user.recentTestHistory.slice(0, 3) : []),
    ];
    await user.save();

    return NextResponse.json({
      success: true,
      data: {
        score,
        totalMarks,
        percentageScore,
        resultLabel,
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
