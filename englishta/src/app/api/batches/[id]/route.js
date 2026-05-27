import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/adminAuth";
import connectToDatabase from "@/lib/mongodb";
import Batch from "@/models/Batch";
import User from "@/models/User";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeStudentIds(value) {
  return Array.isArray(value)
    ? value.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
}

export async function PUT(request, { params }) {
  try {
    await requireAdminAccess();
    await connectToDatabase();

    const { id } = await params;
    const body = await request.json();
    const name = String(body.name || "").trim();
    const studentIds = normalizeStudentIds(body.studentIds);

    if (!name) {
      return NextResponse.json({ success: false, message: "Batch name is required." }, { status: 400 });
    }

    if (studentIds.length) {
      const assignedStudentsCount = await User.countDocuments({ _id: { $in: studentIds }, isActive: true });

      if (assignedStudentsCount !== studentIds.length) {
        return NextResponse.json({ success: false, message: "Please select valid students." }, { status: 400 });
      }
    }

    const batch = await Batch.findByIdAndUpdate(
      id,
      { name, studentIds },
      { new: true, runValidators: true },
    )
      .populate("studentIds", "name email phone")
      .lean();

    if (!batch) {
      return NextResponse.json({ success: false, message: "Batch not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: batch });
  } catch (error) {
    const status = error.status || 500;

    return NextResponse.json(
      { success: false, message: "Failed to update batch.", error: error.message },
      { status },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    await requireAdminAccess();
    await connectToDatabase();

    const { id } = await params;
    const batch = await Batch.findByIdAndDelete(id).lean();

    if (!batch) {
      return NextResponse.json({ success: false, message: "Batch not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: batch });
  } catch (error) {
    const status = error.status || 500;

    return NextResponse.json(
      { success: false, message: "Failed to delete batch.", error: error.message },
      { status },
    );
  }
}
