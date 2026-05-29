import mongoose from "mongoose";

const skillProgressSchema = new mongoose.Schema(
  {
    speakingConfidence: {
      type: Number,
      default: 0,
    },
    vocabulary: {
      type: Number,
      default: 0,
    },
    grammar: {
      type: Number,
      default: 0,
    },
    communication: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const weeklyChallengeSchema = new mongoose.Schema(
  {
    goalTitle: {
      type: String,
      default: "Complete 3 Tests",
    },
    targetCount: {
      type: Number,
      default: 3,
    },
    completedCount: {
      type: Number,
      default: 0,
    },
    rewardTitle: {
      type: String,
      default: "Consistency Badge",
    },
    weekLabel: {
      type: String,
      default: "This Week",
    },
  },
  { _id: false },
);

const speakingTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Describe your daily routine in English.",
    },
    estimatedMinutes: {
      type: Number,
      default: 5,
    },
    last7Days: {
      type: [Boolean],
      default: [true, true, true, false, true, true, true],
    },
  },
  { _id: false },
);

const scoreHistorySchema = new mongoose.Schema(
  {
    label: {
      type: String,
      default: "",
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const recentTestHistorySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    testName: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    score: {
      type: Number,
      default: 0,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    result: {
      type: String,
      enum: ["Excellent", "Good", "Average", "Improving"],
      default: "Average",
    },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    passwordHash: {
      type: String,
      default: "",
      select: false,
    },
    authProvider: {
      type: String,
      enum: ["credentials", "google", "mixed"],
      default: "credentials",
      index: true,
    },
    googleId: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
    avatarUrl: {
      type: String,
      trim: true,
      default: "",
    },
    profileCompletionPercentage: {
      type: Number,
      default: 0,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    city: {
      type: String,
      trim: true,
      default: "",
    },
    state: {
      type: String,
      trim: true,
      default: "",
    },
    profession: {
      type: String,
      trim: true,
      default: "",
    },
    englishLevel: {
      type: String,
      enum: ["", "beginner", "intermediate", "advanced"],
      default: "",
    },
    learningGoal: {
      type: String,
      enum: [
        "",
        "spoken-english",
        "job-interview",
        "business-english",
        "fluency",
        "confidence",
        "ielts",
      ],
      default: "",
    },
    dailyPracticeGoalMinutes: {
      type: Number,
      default: 15,
    },
    preferredLanguage: {
      type: String,
      default: "english",
    },
    skillTestCompleted: {
      type: Boolean,
      default: false,
    },
    skillTestScore: {
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
    recommendedCourse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },
    recommendationGenerated: {
      type: Boolean,
      default: false,
    },
    joinedCourses: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        progressPercentage: {
          type: Number,
          default: 0,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    currentStreak: {
      type: Number,
      default: 0,
    },
    totalPracticeMinutes: {
      type: Number,
      default: 0,
    },
    totalTestsCompleted: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    overallProgress: {
      type: Number,
      default: 0,
    },
    skillProgress: {
      type: skillProgressSchema,
      default: () => ({}),
    },
    weeklyChallenge: {
      type: weeklyChallengeSchema,
      default: () => ({}),
    },
    dailySpeakingTask: {
      type: speakingTaskSchema,
      default: () => ({}),
    },
    scoreHistory: {
      type: [scoreHistorySchema],
      default: [
        { label: "Week 1", score: 45 },
        { label: "Week 2", score: 58 },
        { label: "Week 3", score: 67 },
        { label: "Week 4", score: 78 },
      ],
    },
    recentTestHistory: {
      type: [recentTestHistorySchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "users",
  },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
