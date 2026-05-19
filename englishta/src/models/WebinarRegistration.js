import mongoose from "mongoose";

const webinarRegistrationSchema = new mongoose.Schema(
  {
    webinarId: {
      type: String,
      default: "",
      trim: true,
    },
    webinarTitle: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
      trim: true,
    },
    occupation: {
      type: String,
      enum: ["student", "employed"],
      required: true,
      trim: true,
    },
    preferredLanguage: {
      type: String,
      enum: ["english", "hindi", "marathi"],
      required: true,
      trim: true,
    },
    standard: {
      type: String,
      default: "",
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Registered", "Closed"],
      default: "New",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.WebinarRegistration ||
  mongoose.model("WebinarRegistration", webinarRegistrationSchema);
