import mongoose from "mongoose";
import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import { getUserTokenPayload } from "@/lib/userAuth";
import Course from "@/models/Course";
import Payment from "@/models/Payment";
import User from "@/models/User";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RAZORPAY_ORDERS_URL = "https://api.razorpay.com/v1/orders";

function getAdvanceAmount() {
  const amount = Number(process.env.RAZORPAY_ADVANCE_AMOUNT || 999);
  return Number.isFinite(amount) && amount > 0 ? amount : 999;
}

export async function POST(request) {
  try {
    const tokenPayload = await getUserTokenPayload();

    if (!tokenPayload?.sub) {
      return NextResponse.json(
        { success: false, message: "Please login to continue payment." },
        { status: 401 },
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId.includes("replace_with") || keySecret.includes("replace_with")) {
      return NextResponse.json(
        { success: false, message: "Razorpay keys are not configured yet." },
        { status: 500 },
      );
    }

    const body = await request.json();
    const courseId = String(body.courseId || "").trim();

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json({ success: false, message: "Valid course is required." }, { status: 400 });
    }

    await connectToDatabase();

    const [user, course] = await Promise.all([
      User.findOne({ _id: tokenPayload.sub, isActive: true }).lean(),
      Course.findById(courseId).lean(),
    ]);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please login to continue payment." },
        { status: 401 },
      );
    }

    if (!course) {
      return NextResponse.json({ success: false, message: "Course not found." }, { status: 404 });
    }

    const alreadyPaid = await Payment.exists({
      user: user._id,
      course: course._id,
      status: "paid",
    });

    if (alreadyPaid) {
      return NextResponse.json({ success: false, message: "Payment is already completed for this course." }, { status: 409 });
    }

    const advanceAmount = getAdvanceAmount();
    const amountInPaise = Math.round(advanceAmount * 100);
    const receipt = `englishta_${Date.now()}`;
    const authToken = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const orderResponse = await fetch(RAZORPAY_ORDERS_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt,
        notes: {
          userId: String(user._id),
          courseId: String(course._id),
          courseName: course.name || "",
        },
      }),
    });

    const order = await orderResponse.json();

    if (!orderResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: order?.error?.description || "Unable to create Razorpay order.",
        },
        { status: 502 },
      );
    }

    await Payment.create({
      user: user._id,
      course: course._id,
      amount: advanceAmount,
      currency: "INR",
      status: "created",
      razorpayOrderId: order.id,
      receipt,
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      keyId,
      course: {
        name: course.name || "",
      },
      user: {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to start payment.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
