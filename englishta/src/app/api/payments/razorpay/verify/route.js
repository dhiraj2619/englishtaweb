import crypto from "crypto";

import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import { getUserTokenPayload, sanitizeUser } from "@/lib/userAuth";
import Payment from "@/models/Payment";
import User from "@/models/User";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret || keySecret.includes("replace_with")) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature);
  const receivedBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

export async function POST(request) {
  try {
    const tokenPayload = await getUserTokenPayload();

    if (!tokenPayload?.sub) {
      return NextResponse.json(
        { success: false, message: "Please login to verify payment." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const orderId = String(body.razorpay_order_id || "").trim();
    const paymentId = String(body.razorpay_payment_id || "").trim();
    const signature = String(body.razorpay_signature || "").trim();

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ success: false, message: "Payment verification details are missing." }, { status: 400 });
    }

    await connectToDatabase();

    const payment = await Payment.findOne({
      razorpayOrderId: orderId,
      user: tokenPayload.sub,
    });

    if (!payment) {
      return NextResponse.json({ success: false, message: "Payment order not found." }, { status: 404 });
    }

    const isValidSignature = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature,
    });

    if (!isValidSignature) {
      payment.status = "failed";
      payment.razorpayPaymentId = paymentId;
      payment.razorpaySignature = signature;
      await payment.save();

      return NextResponse.json({ success: false, message: "Payment verification failed." }, { status: 400 });
    }

    const user = await User.findOne({ _id: tokenPayload.sub, isActive: true });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }

    const alreadyJoined = user.joinedCourses.some(
      (joinedCourse) => String(joinedCourse.course) === String(payment.course),
    );

    if (!alreadyJoined) {
      user.joinedCourses.push({
        course: payment.course,
        joinedAt: new Date(),
        progressPercentage: 0,
        completed: false,
      });

      user.profileCompletionPercentage = Math.max(user.profileCompletionPercentage || 0, 20);
      await user.save();
    }

    payment.status = "paid";
    payment.razorpayPaymentId = paymentId;
    payment.razorpaySignature = signature;
    await payment.save();

    return NextResponse.json({
      success: true,
      alreadyJoined,
      message: "Payment successful. Your course seat is confirmed.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to verify payment.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
