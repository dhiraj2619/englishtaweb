import mongoose from "mongoose";

const youtubeVideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    youtubeIframe: {
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

export default mongoose.models.YoutubeVideo || mongoose.model("YoutubeVideo", youtubeVideoSchema);
