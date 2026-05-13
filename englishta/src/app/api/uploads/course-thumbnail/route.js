import { createHash } from "crypto";
import { NextResponse } from "next/server";

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || "englishta/courses";

function createSignature(timestamp, folder) {
  const signatureBase = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  return createHash("sha1").update(signatureBase).digest("hex");
}

export async function POST(request) {
  try {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { success: false, message: "Cloudinary environment variables are missing." },
        { status: 500 },
      );
    }

    const incomingFormData = await request.formData();
    const file = incomingFormData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, message: "Image file is required." }, { status: 400 });
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = createSignature(timestamp, CLOUDINARY_FOLDER);

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("api_key", CLOUDINARY_API_KEY);
    uploadFormData.append("timestamp", timestamp);
    uploadFormData.append("signature", signature);
    uploadFormData.append("folder", CLOUDINARY_FOLDER);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: uploadFormData,
    });
    const payload = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: payload.error?.message || "Failed to upload image to Cloudinary." },
        { status: response.status },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        url: payload.secure_url,
        publicId: payload.public_id,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Thumbnail upload failed.", error: error.message },
      { status: 500 },
    );
  }
}
