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

const weeklyTestAttemptSchema = new mongoose.Schema(
  {
    weekLabel: {
      type: String,
      default: "",
    },
    weekStartDate: {
      type: Date,
      default: null,
    },
    weekEndDate: {
      type: Date,
      default: null,
    },
    attemptedCount: {
      type: Number,
      default: 0,
    },
    assignedCount: {
      type: Number,
      default: 0,
    },
    averageScore: {
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

const testStatisticsSchema = new mongoose.Schema(
  {
    weeklyTestsAttempted: {
      type: Number,
      default: 0,
    },
    totalTestsAssigned: {
      type: Number,
      default: 0,
    },
    totalTestsAttempted: {
      type: Number,
      default: 0,
    },
    highestScore: {
      type: Number,
      default: 0,
    },
    lowestScore: {
      type: Number,
      default: 0,
    },
    improvementPercentage: {
      type: Number,
      default: 0,
    },
    performanceTrend: {
      type: String,
      enum: ["", "improving", "stable", "declining"],
      default: "",
    },
  },
  { _id: false },
);

const adminRemarkSchema = new mongoose.Schema(
  {
    remark: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      enum: ["general", "attendance", "performance", "discipline", "offer"],
      default: "general",
    },
    createdBy: {
      type: String,
      trim: true,
      default: "Admin",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true },
);

const specialCourseOfferSchema = new mongoose.Schema(
  {
    eligible: {
      type: Boolean,
      default: false,
    },
    reason: {
      type: String,
      trim: true,
      default: "",
    },
    scoreThreshold: {
      type: Number,
      default: 90,
    },
    offeredCourse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },
    offerTitle: {
      type: String,
      trim: true,
      default: "",
    },
    offerValidTill: {
      type: Date,
      default: null,
    },
  },
  { _id: false },
);

const courseProgressSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      default: null,
    },
    progressPercentage: {
      type: Number,
      default: 0,
    },
    completedLessons: {
      type: Number,
      default: 0,
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    sessionsAttended: {
      type: Number,
      default: 0,
    },
    sessionsMissed: {
      type: Number,
      default: 0,
    },
    lastSessionAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed", "paused"],
      default: "not-started",
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
      enum: ["", "beginner", "intermediate"],
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
    weeklyTestAttempts: {
      type: [weeklyTestAttemptSchema],
      default: [],
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
    testStatistics: {
      type: testStatisticsSchema,
      default: () => ({}),
    },
    courseProgress: {
      type: [courseProgressSchema],
      default: [],
    },
    adminRemarks: {
      type: [adminRemarkSchema],
      default: [],
    },
    attendanceStatus: {
      type: String,
      enum: ["regular", "irregular", "defaulter"],
      default: "regular",
      index: true,
    },
    isDefaulter: {
      type: Boolean,
      default: false,
      index: true,
    },
    defaulterReason: {
      type: String,
      trim: true,
      default: "",
    },
    lastAttendedSessionAt: {
      type: Date,
      default: null,
    },
    missedSessionsCount: {
      type: Number,
      default: 0,
    },
    specialCourseOffer: {
      type: specialCourseOfferSchema,
      default: () => ({}),
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
