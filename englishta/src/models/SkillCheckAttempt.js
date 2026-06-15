import mongoose from "mongoose";

const skillCheckAnswerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    selectedOptionIndex: {
      type: Number,
      required: true,
    },
    correct: {
      type: Boolean,
      default: false,
    },
    marksAwarded: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const skillCheckAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SkillCheckTest",
      required: true,
      index: true,
    },
    answers: [skillCheckAnswerSchema],
    score: {
      type: Number,
      default: 0,
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    speakingScore: {
      type: Number,
      default: 0,
    },
    vocabularyScore: {
      type: Number,
      default: 0,
    },
    confidenceScore: {
      type: Number,
      default: 0,
    },
    grammarScore: {
      type: Number,
      default: 0,
    },
    resultLevel: {
      type: String,
      enum: ["beginner", "intermediate"],
      default: "beginner",
    },
    warningCount: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "skill_check_attempts",
  },
);

const SkillCheckAttempt =
  mongoose.models.SkillCheckAttempt || mongoose.model("SkillCheckAttempt", skillCheckAttemptSchema);

export default SkillCheckAttempt;
