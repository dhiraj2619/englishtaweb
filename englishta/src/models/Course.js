import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
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
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Course || mongoose.model("Course", courseSchema);
