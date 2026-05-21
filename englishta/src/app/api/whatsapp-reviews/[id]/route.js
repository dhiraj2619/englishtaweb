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

async function validateUniqueDisplayOrder(displayOrder, id) {
  const existingReview = await WhatsAppReview.findOne({
    displayOrder,
    _id: { $ne: id },
  }).lean();

  if (existingReview) {
    return `Display order ${displayOrder} is already used. Please choose a different order.`;
  }

  return null;
}

export async function PUT(request, { params }) {
  try {
    await requireAdminAccess();
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const errorMessage = validateWhatsAppReviewPayload(body);

    if (errorMessage) {
      return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
    }

    const normalizedBody = normalizeWhatsAppReviewPayload(body);
    const duplicateOrderMessage = await validateUniqueDisplayOrder(normalizedBody.displayOrder, id);

    if (duplicateOrderMessage) {
      return NextResponse.json({ success: false, message: duplicateOrderMessage }, { status: 409 });
    }

    const review = await WhatsAppReview.findByIdAndUpdate(id, normalizedBody, {
      new: true,
      runValidators: true,
    });

    if (!review) {
      return NextResponse.json({ success: false, message: "WhatsApp review not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    const status = error.status || 400;
    console.error("Failed to update WhatsApp review:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Failed to update WhatsApp review.", error: error.message },
      { status },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    await requireAdminAccess();
    await connectToDatabase();
    const { id } = await params;

    const review = await WhatsAppReview.findByIdAndDelete(id);

    if (!review) {
      return NextResponse.json({ success: false, message: "WhatsApp review not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const status = error.status || 400;
    console.error("Failed to delete WhatsApp review:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete WhatsApp review.", error: error.message },
      { status },
    );
  }
}
