import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      trim: true,
    },
    firstName: {
      type: String,
      default: "",
      trim: true,
    },
    lastName: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    mobile: {
      type: String,
      default: "",
      trim: true,
    },
    gender: {
      type: String,
      default: "",
      trim: true,
    },
    occupation: {
      type: String,
      default: "",
      trim: true,
    },
    standard: {
      type: String,
      default: "",
      trim: true,
    },
    city: {
      type: String,
      default: "",
      trim: true,
    },
    state: {
      type: String,
      default: "",
      trim: true,
    },
    source: {
      type: String,
      enum: ["Course Inquiry", "Webinar Registration"],
      required: true,
    },
    course: {
      type: String,
      default: "",
      trim: true,
    },
    message: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Enrolled", "Closed"],
      default: "New",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Lead || mongoose.model("Lead", leadSchema);
