import mongoose from "mongoose";

const demoLectureVideoSchema = new mongoose.Schema(
  {
    youtubeEmbedCode: {
      type: String,
      required: true,
      trim: true,
    },
    youtubeUrl: {
      type: String,
      trim: true,
      default: "",
    },
    youtubeIframe: {
      type: String,
      trim: true,
      default: "",
    },
    thumbnail: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

if (
  mongoose.models.DemoLectureVideo &&
  !mongoose.models.DemoLectureVideo.schema.path("youtubeEmbedCode")
) {
  delete mongoose.models.DemoLectureVideo;
}

export default mongoose.models.DemoLectureVideo || mongoose.model("DemoLectureVideo", demoLectureVideoSchema);
