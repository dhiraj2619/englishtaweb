import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/adminAuth";
import connectToDatabase from "@/lib/mongodb";
import Course from "@/models/Course";
import CourseLead from "@/models/CourseLead";
import Webinar from "@/models/Webinar";
import WebinarRegistration from "@/models/WebinarRegistration";
import WhatsAppReview from "@/models/WhatsAppReview";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdminAccess();
    await connectToDatabase();

    const [
      coursesCount,
      webinarsCount,
      courseInquiryCount,
      webinarRegistrationCount,
      whatsAppReviewCount,
      courses,
    ] = await Promise.all([
      Course.countDocuments(),
      Webinar.countDocuments(),
      CourseLead.countDocuments(),
      WebinarRegistration.countDocuments(),
      WhatsAppReview.countDocuments(),
      Course.find({}, { studentsEnrolled: 1 }).lean(),
    ]);

    const courseEnrollmentCount = courses.reduce((total, course) => total + (Number(course.studentsEnrolled) || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        coursesCount,
        webinarsCount,
        courseInquiryCount,
        webinarRegistrationCount,
        whatsAppReviewCount,
        courseEnrollmentCount,
      },
    });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ success: false, message: "Failed to load admin stats.", error: error.message }, { status });
  }
}
