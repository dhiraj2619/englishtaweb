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

async function getUniqueSlug(title, existingId) {
  const baseSlug = createSlug(title) || "blog";
  let slug = baseSlug;
  let suffix = 1;

  while (await Blog.exists({ slug, _id: { $ne: existingId } })) {
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

async function normalizeBlogPayload(payload, existingId) {
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

export async function GET(_request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const blog = await Blog.findById(id).lean();

    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    console.error("Failed to fetch blog:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch blog.", error: error.message },
      { status: 400 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await requireAdminAccess();
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const errorMessage = validateBlogPayload(body);

    if (errorMessage) {
      return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
    }

    const normalizedBody = await normalizeBlogPayload(body, id);
    const blog = await Blog.findByIdAndUpdate(id, normalizedBody, {
      new: true,
      runValidators: true,
    }).lean();

    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { ...blog, ...normalizedBody } });
  } catch (error) {
    const status = error.status || 400;
    console.error("Failed to update blog:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update blog.", error: error.message },
      { status },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    await requireAdminAccess();
    await connectToDatabase();
    const { id } = await params;
    const blog = await Blog.findByIdAndDelete(id).lean();

    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    const status = error.status || 400;
    console.error("Failed to delete blog:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete blog.", error: error.message },
      { status },
    );
  }
}
