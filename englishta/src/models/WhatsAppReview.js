import mongoose from "mongoose";

const whatsAppReviewSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      min: 0,
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
  mongoose.models.WhatsAppReview &&
  (mongoose.models.WhatsAppReview.schema.path("name") ||
    !mongoose.models.WhatsAppReview.schema.path("displayOrder"))
) {
  mongoose.deleteModel("WhatsAppReview");
}

export default mongoose.models.WhatsAppReview || mongoose.model("WhatsAppReview", whatsAppReviewSchema);
