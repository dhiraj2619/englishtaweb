import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/adminAuth";
import connectToDatabase from "@/lib/mongodb";
import Blog from "@/models/Blog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function createSlug(title) {
  return String(title || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getUniqueSlug(title, existingId = null) {
  const baseSlug = createSlug(title) || "blog";
  let slug = baseSlug;
  let suffix = 1;

  while (await Blog.exists({ slug, ...(existingId ? { _id: { $ne: existingId } } : {}) })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

function validateBlogPayload(payload) {
  if (
    !payload.title?.trim() ||
    !payload.thumbnail?.trim() ||
    !payload.shortDescription?.trim() ||
    !payload.content?.trim()
  ) {
    return "Title, short description, full blog content, and thumbnail are required.";
  }

  return "";
}

async function normalizeBlogPayload(payload, existingId = null) {
  return {
    title: payload.title?.trim() || "",
    slug: await getUniqueSlug(payload.title, existingId),
    thumbnail: payload.thumbnail?.trim() || "",
    shortDescription: payload.shortDescription?.trim() || "",
    content: payload.content?.trim() || "",
    metaTitle: payload.metaTitle?.trim() || "",
    metaDescription: payload.metaDescription?.trim() || "",
    keywords: payload.keywords?.trim() || "",
    visible: payload.visible === "No" ? "No" : "Yes",
  };
}

export async function GET() {
  try {
    await connectToDatabase();
    const blogs = await Blog.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: blogs });
  } catch (error) {
    console.error("Failed to fetch blogs:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch blogs.", error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    await requireAdminAccess();
    await connectToDatabase();
    const body = await request.json();
    const errorMessage = validateBlogPayload(body);

    if (errorMessage) {
      return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
    }

    const normalizedBody = await normalizeBlogPayload(body);
    const blog = await Blog.create(normalizedBody);

    return NextResponse.json({ success: true, data: blog.toObject() }, { status: 201 });
  } catch (error) {
    const status = error.status || 400;
    console.error("Failed to create blog:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create blog.", error: error.message },
      { status },
    );
  }
}
