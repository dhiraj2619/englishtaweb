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
