import mongoose from "mongoose";

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
