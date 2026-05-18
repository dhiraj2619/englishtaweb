import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: String,
      enum: ["1", "2", "3", "4", "5"],
      default: "5",
    },
    review: {
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

export default mongoose.models.Testimonial || mongoose.model("Testimonial", testimonialSchema);
