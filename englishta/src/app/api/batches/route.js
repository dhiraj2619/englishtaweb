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

function normalizeBatchSize(value) {
  const size = Number(value);
  return Number.isFinite(size) && size > 0 ? Math.floor(size) : 0;
}

async function populateBatch(batch) {
  const populatedBatch = await Batch.findById(batch._id)
    .populate("studentIds", "name email phone")
    .lean();

  return withTotalStudents(populatedBatch);
}

function withTotalStudents(batch) {
  if (!batch) return batch;

  return {
    ...batch,
    totalStudents: Number(batch.totalStudents) || 0,
    assignedStudentsCount: Array.isArray(batch.studentIds) ? batch.studentIds.length : 0,
  };
}

export async function GET() {
  try {
    await requireAdminAccess();
    await connectToDatabase();

    const batches = await Batch.find()
      .populate("studentIds", "name email phone")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: batches.map(withTotalStudents) });
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
    const totalStudents = normalizeBatchSize(body.totalStudents);

    if (!name) {
      return NextResponse.json({ success: false, message: "Batch name is required." }, { status: 400 });
    }

    if (!totalStudents) {
      return NextResponse.json({ success: false, message: "Batch size is required." }, { status: 400 });
    }

    if (studentIds.length > totalStudents) {
      return NextResponse.json(
        { success: false, message: "Batch size cannot be smaller than assigned students." },
        { status: 400 },
      );
    }

    if (studentIds.length) {
      const assignedStudentsCount = await User.countDocuments({ _id: { $in: studentIds }, isActive: true });

      if (assignedStudentsCount !== studentIds.length) {
        return NextResponse.json({ success: false, message: "Please select valid students." }, { status: 400 });
      }
    }

    const batch = await Batch.create({ name, studentIds, totalStudents });
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
