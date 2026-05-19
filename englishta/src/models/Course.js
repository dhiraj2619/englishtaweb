import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    courseMode: {
      type: String,
      enum: ["live", "recorded", "audio", "progress"],
      default: "live",
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    longDescription: {
      type: String,
      required: true,
      trim: true,
    },
    syllabus: {
      type: String,
      default: "",
      trim: true,
    },
    timeline: {
      type: String,
      default: "",
      trim: true,
    },
    languages: {
      type: [String],
      enum: ["marathi", "hindi", "english"],
      default: ["marathi", "hindi", "english"],
    },
    allowBooking: {
      type: String,
      enum: ["Yes", "No"],
      default: "Yes",
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
    studentsEnrolled: {
      type: String,
      required: true,
      trim: true,
    },
    visible: {
      type: String,
      enum: ["Yes", "No"],
      default: "Yes",
    },
  },
  {
    timestamps: true,
  },
);

if (
  mongoose.models.Course &&
  (mongoose.models.Course.schema.path("batchType") ||
    !mongoose.models.Course.schema.path("timeline"))
) {
  mongoose.deleteModel("Course");
}

export default mongoose.models.Course || mongoose.model("Course", courseSchema);
