import mongoose from "mongoose";

const skillCheckQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      trim: true,
      required: true,
    },
    category: {
      type: String,
      enum: ["speaking", "vocabulary", "confidence", "grammar"],
      default: "vocabulary",
    },
    options: {
      type: [String],
      validate: {
        validator: (value) => Array.isArray(value) && value.filter(Boolean).length === 3,
        message: "Exactly three options are required.",
      },
    },
    optionScores: {
      type: [Number],
      validate: {
        validator: (value) => Array.isArray(value) && value.length === 3 && value.every((score) => [1, 2, 3].includes(Number(score))),
        message: "Each option must have a score from 1 to 3.",
      },
      default: [1, 2, 3],
    },
    correctOptionIndex: {
      type: Number,
      min: 0,
      default: 2,
    },
    marks: {
      type: Number,
      min: 1,
      default: 3,
    },
  },
  { _id: true },
);

const skillCheckTestSchema = new mongoose.Schema(
  {
    setCode: {
      type: String,
      enum: ["A", "B", "C", "D"],
      required: true,
      unique: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    timeLimitMinutes: {
      type: Number,
      min: 1,
      default: 15,
    },
    passingScore: {
      type: Number,
      min: 0,
      default: 0,
    },
    questions: [skillCheckQuestionSchema],
    visible: {
      type: String,
      enum: ["Yes", "No"],
      default: "Yes",
    },
  },
  {
    timestamps: true,
    collection: "skill_check_tests",
  },
);

const SkillCheckTest =
  mongoose.models.SkillCheckTest || mongoose.model("SkillCheckTest", skillCheckTestSchema);

export default SkillCheckTest;
