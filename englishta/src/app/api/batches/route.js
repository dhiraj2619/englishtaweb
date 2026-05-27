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

async function populateBatch(batch) {
  return Batch.findById(batch._id)
    .populate("studentIds", "name email phone")
    .lean();
}

export async function GET() {
  try {
    await requireAdminAccess();
    await connectToDatabase();

    const batches = await Batch.find()
      .populate("studentIds", "name email phone")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: batches });
  } catch (error) {
    const status = error.status || 500;

    return NextResponse.json(
      { success: false, message: "Failed to load batches.", error: error.message },
      { status },
    );
  }
}

export async function POST(request) {
  try {
    await requireAdminAccess();
    await connectToDatabase();

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

    const batch = await Batch.create({ name, studentIds });
    const populatedBatch = await populateBatch(batch);

    return NextResponse.json({ success: true, data: populatedBatch }, { status: 201 });
  } catch (error) {
    const status = error.status || 500;

    return NextResponse.json(
      { success: false, message: "Failed to create batch.", error: error.message },
      { status },
    );
  }
}
