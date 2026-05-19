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
    batchType: {
      type: String,
      enum: ["beginners", "advanced", "speakers", "interview", "grammar", "super5", "oneOnOne"],
      default: "beginners",
      required: true,
      trim: true,
    },
    cardTitle: {
      type: String,
      default: "",
      trim: true,
    },
    cardSubtitle: {
      type: String,
      default: "",
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
    languages: {
      type: [String],
      enum: ["marathi", "hindi", "english"],
      default: ["marathi", "hindi", "english"],
    },
    benefits: {
      type: [String],
      default: ["Early Bird Offer", "Free Speaking Club", "Bonus PDFs", "WhatsApp Group"],
    },
    badge: {
      type: String,
      default: "",
      trim: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    theme: {
      type: String,
      enum: ["yellow", "orange", "purple", "blue", "green", "dark"],
      default: "yellow",
      trim: true,
    },
    icon: {
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
  (!mongoose.models.Course.schema.path("courseMode") ||
    !mongoose.models.Course.schema.path("batchType") ||
    !mongoose.models.Course.schema.path("benefits"))
) {
  mongoose.deleteModel("Course");
}

export default mongoose.models.Course || mongoose.model("Course", courseSchema);
