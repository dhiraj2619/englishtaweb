import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/adminAuth";
import connectToDatabase from "@/lib/mongodb";
import WhatsAppReview from "@/models/WhatsAppReview";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validateWhatsAppReviewPayload(payload) {
  if (!payload.image?.trim()) return "WhatsApp review image is required.";
  const displayOrder = Number(payload.displayOrder);

  if (!Number.isInteger(displayOrder) || displayOrder < 1) {
    return "Please enter a valid display order.";
  }

  return null;
}

function normalizeWhatsAppReviewPayload(payload) {
  const displayOrder = Number(payload.displayOrder);

  return {
    image: payload.image?.trim() || "",
    displayOrder: Number.isInteger(displayOrder) && displayOrder > 0 ? displayOrder : 1,
    visible: payload.visible === "No" ? "No" : "Yes",
  };
}

async function validateUniqueDisplayOrder(displayOrder) {
  const existingReview = await WhatsAppReview.findOne({ displayOrder }).lean();

  if (existingReview) {
    return `Display order ${displayOrder} is already used. Please choose a different order.`;
  }

  return null;
}

function sortWhatsAppReviews(reviews) {
  return reviews.sort((first, second) => {
    const firstOrder = Number.isFinite(Number(first.displayOrder)) ? Number(first.displayOrder) : Number.MAX_SAFE_INTEGER;
    const secondOrder = Number.isFinite(Number(second.displayOrder)) ? Number(second.displayOrder) : Number.MAX_SAFE_INTEGER;

    if (firstOrder !== secondOrder) {
      return firstOrder - secondOrder;
    }

    return new Date(second.createdAt || 0).getTime() - new Date(first.createdAt || 0).getTime();
  });
}

export async function GET() {
  try {
    await connectToDatabase();
    const reviews = sortWhatsAppReviews(await WhatsAppReview.find().lean());

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch WhatsApp reviews.", error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    await requireAdminAccess();
    await connectToDatabase();
    const body = await request.json();
    const errorMessage = validateWhatsAppReviewPayload(body);

    if (errorMessage) {
      return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
    }

    const normalizedBody = normalizeWhatsAppReviewPayload(body);
    const duplicateOrderMessage = await validateUniqueDisplayOrder(normalizedBody.displayOrder);

    if (duplicateOrderMessage) {
      return NextResponse.json({ success: false, message: duplicateOrderMessage }, { status: 409 });
    }

    const review = await WhatsAppReview.create(normalizedBody);
    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    const status = error.status || 400;
    console.error("Failed to create WhatsApp review:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Failed to create WhatsApp review.", error: error.message },
      { status },
    );
  }
}
