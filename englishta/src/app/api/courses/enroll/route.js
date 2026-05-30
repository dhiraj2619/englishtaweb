import mongoose from "mongoose";
import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import { getUserTokenPayload, sanitizeUser } from "@/lib/userAuth";
import Course from "@/models/Course";
import User from "@/models/User";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const payload = await getUserTokenPayload();

    if (!payload?.sub) {
      return NextResponse.json(
        { success: false, message: "Please login to enroll in this course." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const courseId = String(body.courseId || "").trim();

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json(
        { success: false, message: "Valid course is required." },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const [user, course] = await Promise.all([
      User.findOne({ _id: payload.sub, isActive: true }),
      Course.findById(courseId),
    ]);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please login to enroll in this course." },
        { status: 401 },
      );
    }

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found." },
        { status: 404 },
      );
    }

    const alreadyJoined = user.joinedCourses.some(
      (joinedCourse) => String(joinedCourse.course) === String(course._id),
    );

    if (!alreadyJoined) {
      user.joinedCourses.push({
        course: course._id,
        joinedAt: new Date(),
        progressPercentage: 0,
        completed: false,
      });

      user.profileCompletionPercentage = Math.max(
        user.profileCompletionPercentage || 0,
        20,
      );

      await user.save();
    }

    return NextResponse.json({
      success: true,
      alreadyJoined,
      message: alreadyJoined
        ? "You are already enrolled in this course."
        : "You are enrolled in this course.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to enroll in this course.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
