import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import { getUserTokenPayload } from "@/lib/userAuth";
import Course from "@/models/Course";
import User from "@/models/User";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function serializeCourse(course) {
  if (!course) return null;

  return {
    _id: String(course._id),
    name: course.name || "",
    courseMode: course.courseMode || "live",
    thumbnail: course.thumbnail || "",
    shortDescription: course.shortDescription || "",
    longDescription: course.longDescription || "",
    syllabus: course.syllabus || "",
    timeline: course.timeline || "",
    languages: Array.isArray(course.languages) ? course.languages : [],
    allowBooking: course.allowBooking || "Yes",
    actualPrice: course.actualPrice || "",
    discountedPrice: course.discountedPrice || "",
    price: course.price || "",
    studentsEnrolled: course.studentsEnrolled || "",
    visible: course.visible || "Yes",
  };
}

export async function GET() {
  try {
    const payload = await getUserTokenPayload();

    if (!payload?.sub) {
      return NextResponse.json(
        { success: false, message: "Please login to view joined courses." },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ _id: payload.sub, isActive: true })
      .populate({
        path: "joinedCourses.course",
        model: Course,
      })
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 },
      );
    }

    const joinedCourses = (user.joinedCourses || [])
      .map((joinedCourse) => ({
        joinedAt: joinedCourse.joinedAt || null,
        progressPercentage: joinedCourse.progressPercentage || 0,
        completed: Boolean(joinedCourse.completed),
        course: serializeCourse(joinedCourse.course),
      }))
      .filter((joinedCourse) => joinedCourse.course);

    return NextResponse.json({
      success: true,
      data: joinedCourses,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to load joined courses.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
