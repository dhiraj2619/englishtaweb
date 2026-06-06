"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const standardOptions = [
  "4th Standard",
  "5th Standard",
  "6th Standard",
  "7th Standard",
  "8th Standard",
  "9th Standard",
  "10th Standard",
  "11th Standard",
  "12th Standard",
  "Diploma",
  "Bachelor of Arts (BA)",
  "Bachelor of Commerce (BCom)",
  "Bachelor of Science (BSc)",
  "Bachelor of Business Administration (BBA)",
  "Bachelor of Computer Applications (BCA)",
  "Bachelor of Engineering (BE)",
  "Bachelor of Technology (BTech)",
  "Bachelor of Education (BEd)",
  "Bachelor of Pharmacy (BPharm)",
  "Bachelor of Management Studies (BMS)",
  "Master of Arts (MA)",
  "Master of Commerce (MCom)",
  "Master of Science (MSc)",
  "Master of Business Administration (MBA)",
  "Master of Computer Applications (MCA)",
  "Master of Technology (MTech)",
  "Master of Education (MEd)",
  "Master of Pharmacy (MPharm)",
];

const preferredLanguageOptions = [
  ["english", "English"],
  ["hindi", "Hindi"],
  ["marathi", "Marathi"],
];

const slugifyCourseName = (name = "") =>
  name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const splitSyllabus = (syllabus = "") =>
  syllabus
    .replace(/<[^>]*>/g, ",")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

const sanitizeCourseHtml = (html = "") =>
  html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/\sjavascript:/gi, "");

const normalizePrice = (price) => {
  const normalizedPrice = String(price || "").trim();
  const lowerPrice = normalizedPrice.toLowerCase();

  if (!normalizedPrice) return "";
  if (lowerPrice.startsWith("rs") || normalizedPrice.startsWith("\u20b9")) return normalizedPrice;

  return `\u20b9${normalizedPrice}`;
};

const parsePriceAmount = (price) => {
  const amount = Number(String(price || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
};

const loadRazorpayCheckout = () =>
  new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Payment can only be started in the browser."));
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Unable to load Razorpay checkout."));
    document.body.appendChild(script);
  });

const CourseDetailPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollFeedback, setEnrollFeedback] = useState({ type: "", message: "" });
  const [successModalContent, setSuccessModalContent] = useState({
    eyebrow: "Course Lead Submitted",
    title: "Thank you for your response",
    message: "We have received your request and will contact you soon.",
    actionLabel: "Close",
    actionHref: "",
  });
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "male",
    occupation: "student",
    preferredLanguage: "english",
    standard: "",
    city: "",
    state: "",
    message: "",
  });

  useEffect(() => {
    let isMounted = true;

    fetch("/api/courses", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => {
        if (!isMounted) return;

        if (!payload.success) {
          throw new Error(payload.message || "Failed to load course.");
        }

        setCourses(payload.data ?? []);
      })
      .catch((fetchError) => {
        if (isMounted) {
          setError(fetchError.message || "Failed to load course.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        const payload = await response.json();
        return payload?.user || null;
      })
      .then((user) => {
        if (isMounted) {
          setCurrentUser(user);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCurrentUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const course = useMemo(
    () => courses.find((item) => slugifyCourseName(item.name) === slug),
    [courses, slug],
  );

  const rawSyllabus = course?.syllabus ?? "";
  const rawLongDescription = course?.longDescription ?? "";
  const discountedPrice = normalizePrice(course?.discountedPrice || course?.price);
  const actualPrice = normalizePrice(course?.actualPrice);
  const advanceBookingAmount = 999;
  const courseFeeAmount = parsePriceAmount(course?.discountedPrice || course?.price);
  const remainingAmount = courseFeeAmount > advanceBookingAmount ? courseFeeAmount - advanceBookingAmount : 0;
  const hasRichLongDescription = /<\/?(h[1-6]|ul|ol|li|p|strong|em|br|blockquote)\b/i.test(rawLongDescription);
  const longDescriptionHtml = sanitizeCourseHtml(rawLongDescription);
  const hasRichSyllabus = /<\/?(h[1-6]|ul|ol|li|p|strong|em|br)\b/i.test(rawSyllabus);
  const syllabusHtml = sanitizeCourseHtml(rawSyllabus);
  const syllabusItems = splitSyllabus(rawSyllabus);
  const isCurrentUserEnrolled = Array.isArray(currentUser?.joinedCourses)
    ? currentUser.joinedCourses.some((joinedCourse) => {
        const joinedCourseId = joinedCourse?.course?._id || joinedCourse?.course;
        return String(joinedCourseId) === String(course?._id);
      })
    : false;

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleOccupationChange(value) {
    setForm((current) => ({
      ...current,
      occupation: value,
      standard: value === "student" ? current.standard : "",
    }));
  }

  function openJoinModal() {
    setSubmitError("");
    setIsModalOpen(true);
  }

  function closeJoinModal() {
    setIsModalOpen(false);
    setSubmitError("");
  }

  function openEnrollModal() {
    if (isAuthLoading) return;

    if (isCurrentUserEnrolled) {
      router.push("/my-progress");
      return;
    }

    if (!isAuthLoading && !currentUser) {
      window.dispatchEvent(
        new CustomEvent("englishta:protected-navigation", {
          detail: { href: window.location.pathname },
        }),
      );
      return;
    }

    setEnrollFeedback({ type: "", message: "" });
    setIsEnrollModalOpen(true);
  }

  function closeEnrollModal() {
    setIsEnrollModalOpen(false);
    setEnrollFeedback({ type: "", message: "" });
  }

  function closeSuccessModal() {
    setIsSuccessModalOpen(false);
  }

  async function handleJoinSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/course-leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          courseName: course?.name || "",
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to submit course lead.");
      }

      closeJoinModal();
      setSuccessModalContent({
        eyebrow: "Course Lead Submitted",
        title: "Thank you for your response",
        message: "We have received your request and will contact you soon.",
        actionLabel: "Close",
        actionHref: "",
      });
      setIsSuccessModalOpen(true);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        gender: "male",
        occupation: "student",
        preferredLanguage: "english",
        standard: "",
        city: "",
        state: "",
        message: "",
      });
    } catch (submitCourseError) {
      setSubmitError(submitCourseError.message || "Failed to submit course lead.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCourseEnrollment() {
    if (!course?._id) {
      setEnrollFeedback({ type: "error", message: "Course is not ready yet." });
      return;
    }

    if (!currentUser) {
      closeEnrollModal();
      window.dispatchEvent(
        new CustomEvent("englishta:protected-navigation", {
          detail: { href: window.location.pathname },
        }),
      );
      return;
    }

    setIsEnrolling(true);
    setEnrollFeedback({ type: "", message: "" });

    try {
      await loadRazorpayCheckout();

      const orderResponse = await fetch("/api/payments/razorpay/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId: course._id }),
      });
      const orderPayload = await orderResponse.json();

      if (!orderResponse.ok || !orderPayload.success) {
        throw new Error(orderPayload.message || "Unable to start payment.");
      }

      const paymentResult = await new Promise((resolve, reject) => {
        const razorpay = new window.Razorpay({
          key: orderPayload.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderPayload.order.amount,
          currency: orderPayload.order.currency,
          name: "Englishta",
          description: course.name,
          order_id: orderPayload.order.id,
          prefill: {
            name: orderPayload.user?.name || currentUser?.name || "",
            email: orderPayload.user?.email || currentUser?.email || "",
            contact: orderPayload.user?.phone || currentUser?.phone || "",
          },
          theme: {
            color: "#feb60c",
          },
          handler: (response) => resolve(response),
          modal: {
            ondismiss: () => reject(new Error("Payment was cancelled.")),
          },
        });

        razorpay.open();
      });

      const verifyResponse = await fetch("/api/payments/razorpay/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentResult),
      });
      const verifyPayload = await verifyResponse.json();

      if (!verifyResponse.ok || !verifyPayload.success) {
        throw new Error(verifyPayload.message || "Payment verification failed.");
      }

      setCurrentUser(verifyPayload.user || currentUser);
      setIsEnrollModalOpen(false);
      setEnrollFeedback({
        type: "success",
        message: verifyPayload.message || "Payment successful. You are enrolled in this course.",
      });
      setSuccessModalContent({
        eyebrow: "Payment Successful",
        title: "Your course seat is confirmed",
        message: verifyPayload.message || "Payment successful. You are enrolled in this course.",
        actionLabel: "Go to Dashboard",
        actionHref: "/joined-courses",
      });
      setIsSuccessModalOpen(true);
    } catch (enrollError) {
      setEnrollFeedback({
        type: "error",
        message: enrollError.message || "Unable to complete payment.",
      });
    } finally {
      setIsEnrolling(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="englishtaCourseDetail">
        {loading ? (
          <section className="englishtaCourseDetail__loading">
            <div className="container wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s">
              <span />
              <h1>Loading course...</h1>
            </div>
          </section>
        ) : null}

        {!loading && error ? (
          <section className="englishtaCoursesNotice englishtaCourseDetail__notice wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s">
            {error}
          </section>
        ) : null}

        {!loading && !error && !course ? (
          <section className="englishtaCoursesNotice englishtaCourseDetail__notice wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s">
            Course not found. <Link href="/courses">View all courses</Link>
          </section>
        ) : null}

        {!loading && !error && course ? (
          <>
            <section className="englishtaCourseDetailHero">
              <div className="container">
                <div className="englishtaCourseDetailHero__copy wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.15s">
                  <Link href="/courses" className="englishtaCourseDetailHero__back">
                    <i className="fa-solid fa-arrow-left" />
                    Courses
                  </Link>
                  <p>Online English Course</p>
                  <h1>{course.name}</h1>
                  <span>{course.shortDescription}</span>
                  <div className="englishtaCourseDetailHero__actions">
                    {isCurrentUserEnrolled ? (
                      <Link href="/my-progress" className="englishtaCourseDetailHero__primary">
                        View Progress
                      </Link>
                    ) : course.allowBooking === "Yes" ? (
                      <button type="button" className="englishtaCourseDetailHero__primary" onClick={openJoinModal}>
                        Join Course
                      </button>
                    ) : null}
                    <Link href="/contact-us" className="englishtaCourseDetailHero__secondary">
                      Give Feedback
                    </Link>
                  </div>
                </div>
                <div className="englishtaCourseDetailHero__media wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.25s">
                  <img src={course.thumbnail} alt={course.name} />
                  <div>
                    <strong>
                      Starting from {discountedPrice || "Contact Us"}
                      {actualPrice ? <del>{actualPrice}</del> : null}
                    </strong>
                    <span>{course.studentsEnrolled} learners enrolled</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="englishtaCourseDetailBody">
              <div className="container">
                <article className="englishtaCourseDetailBody__main wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.15s">
                  <section className="englishtaCourseDetailSection">
                    <p className="englishtaCourseDetailBody__eyebrow">About this course</p>
                    <h2>Learn with structure, speaking practice, and personal correction.</h2>
                    {hasRichLongDescription ? (
                      <div
                        className="englishtaCourseDetailBody__content"
                        dangerouslySetInnerHTML={{ __html: longDescriptionHtml }}
                      />
                    ) : (
                      <p>{course.longDescription}</p>
                    )}
                  </section>

                  <div className="englishtaCourseDetailHighlights">
                    <span>
                      <i className="fa-solid fa-video" />
                      Live online sessions
                    </span>
                    <span>
                      <i className="fa-solid fa-comments" />
                      Speaking confidence
                    </span>
                    <span>
                      <i className="fa-solid fa-user-check" />
                      Tutor feedback
                    </span>
                  </div>

                  <div id="syllabus" className="englishtaCourseDetailSyllabus">
                    <h2>Syllabus</h2>
                    {hasRichSyllabus ? (
                      <div
                        className="englishtaCourseDetailSyllabus__content"
                        dangerouslySetInnerHTML={{ __html: syllabusHtml }}
                      />
                    ) : syllabusItems.length ? (
                      <ul className="englishtaCourseDetailSyllabus__list">
                        {syllabusItems.map((item) => (
                          <li key={item}>
                            <i className="fa-solid fa-check" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Syllabus details will be shared during counselling.</p>
                    )}
                  </div>
                </article>

                <aside className="englishtaCourseDetailCard wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.25s">
                  <h3>Ready to start?</h3>
                  <p>
                    {isCurrentUserEnrolled
                      ? "Continue your learning journey and track your improvement."
                      : "Tell us your goal and we will suggest the right English practice plan."}
                  </p>
                  {isCurrentUserEnrolled ? (
                    <Link href="/my-progress" className="englishtaCourseDetailCard__primary">
                      View Progress
                    </Link>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="englishtaCourseDetailCard__primary"
                        onClick={openEnrollModal}
                        disabled={isAuthLoading}
                      >
                        Enroll Now
                      </button>
                      <button
                        type="button"
                        className="englishtaCourseDetailCard__outline"
                        onClick={openJoinModal}
                      >
                        Enquire Now
                      </button>
                    </>
                  )}
                  <span>Flexible online batches available</span>
                </aside>
              </div>
              
            </section>
          </>
        ) : null}
      </main>
      {isModalOpen && course ? (
        <div className="englishtaWebinarModal" onClick={closeJoinModal}>
          <div
            className="englishtaWebinarModal__dialog"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-join-title"
          >
            <button type="button" className="englishtaWebinarModal__close" onClick={closeJoinModal}>
              <i className="fa-solid fa-xmark" />
            </button>
            <div className="englishtaWebinarModal__head">
              <p>{course.name}</p>
              <h2 id="course-join-title">Join Course</h2>
            </div>

            <form className="englishtaWebinarModal__form" onSubmit={handleJoinSubmit}>
              <div className="englishtaWebinarModal__grid">
                <label>
                  <span>First Name</span>
                  <input type="text" value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} required />
                </label>
                <label>
                  <span>Last Name</span>
                  <input type="text" value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} required />
                </label>
                <label>
                  <span>Email</span>
                  <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} required />
                </label>
                <label>
                  <span>Mobile</span>
                  <input type="tel" value={form.mobile} onChange={(event) => updateField("mobile", event.target.value)} required />
                </label>
              </div>

              <div className="englishtaWebinarModal__group">
                <span>Gender</span>
                <div className="englishtaWebinarModal__choices">
                  <label><input type="radio" name="course-gender" value="male" checked={form.gender === "male"} onChange={(event) => updateField("gender", event.target.value)} /><span>Male</span></label>
                  <label><input type="radio" name="course-gender" value="female" checked={form.gender === "female"} onChange={(event) => updateField("gender", event.target.value)} /><span>Female</span></label>
                  <label><input type="radio" name="course-gender" value="other" checked={form.gender === "other"} onChange={(event) => updateField("gender", event.target.value)} /><span>Other</span></label>
                </div>
              </div>

              <label className="englishtaWebinarModal__full">
                <span>Occupation</span>
                <select value={form.occupation} onChange={(event) => handleOccupationChange(event.target.value)}>
                  <option value="student">Student</option>
                  <option value="employed">Employed</option>
                </select>
              </label>

              <label className="englishtaWebinarModal__full">
                <span>Preferred Session Language</span>
                <select
                  value={form.preferredLanguage}
                  onChange={(event) => updateField("preferredLanguage", event.target.value)}
                  required
                >
                  {preferredLanguageOptions.map(([value, label]) => (
                    <option value={value} key={value}>{label}</option>
                  ))}
                </select>
              </label>

              {form.occupation === "student" ? (
                <label className="englishtaWebinarModal__full">
                  <span>Standard</span>
                  <select value={form.standard} onChange={(event) => updateField("standard", event.target.value)} required>
                    <option value="">Select standard</option>
                    {standardOptions.map((option) => (
                      <option value={option} key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              ) : null}

              <div className="englishtaWebinarModal__grid">
                <label>
                  <span>City</span>
                  <input type="text" value={form.city} onChange={(event) => updateField("city", event.target.value)} required />
                </label>
                <label>
                  <span>State</span>
                  <input type="text" value={form.state} onChange={(event) => updateField("state", event.target.value)} required />
                </label>
              </div>

              <label className="englishtaWebinarModal__full">
                <span>Message</span>
                <textarea
                  className="englishtaWebinarModal__textarea"
                  value={form.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  placeholder="Tell us your goal or what you want to improve"
                  rows="4"
                />
              </label>

              {submitError ? <p className="englishtaWebinarModal__feedback error">{submitError}</p> : null}

              <button type="submit" className="englishtaWebinarModal__submit">
                {isSubmitting ? "Submitting..." : "Submit"}
                <i className="fa-solid fa-arrow-right" />
              </button>
            </form>
          </div>
        </div>
      ) : null}
      {isEnrollModalOpen && course ? (
        <div className="englishtaWebinarModal" onClick={closeEnrollModal}>
          <div
            className="englishtaWebinarModal__dialog englishtaCourseEnrollModal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-enroll-title"
          >
            <button type="button" className="englishtaWebinarModal__close" onClick={closeEnrollModal}>
              <i className="fa-solid fa-xmark" />
            </button>

            <div className="englishtaCourseEnrollModal__layout">
              <section className="englishtaCourseEnrollModal__summary">
                <h2 id="course-enroll-title">Join This Course</h2>
                <p>
                  Start your English speaking journey today.
                  <strong> Secure your seat by paying the advance amount online.</strong>
                </p>

                <div className="englishtaCourseEnrollModal__details">
                  <article>
                    <span><i className="fa-solid fa-book-open" /></span>
                    <div>
                      <strong>Course Name</strong>
                      <p>{course.name}</p>
                    </div>
                  </article>
                  <article>
                    <span><i className="fa-regular fa-calendar-days" /></span>
                    <div>
                      <strong>Duration</strong>
                      <p>{course.duration || "3 Months"}</p>
                    </div>
                  </article>
                  <article>
                    <span><i className="fa-solid fa-users" /></span>
                    <div>
                      <strong>Batch</strong>
                      <p>Flexible Online Batch</p>
                    </div>
                  </article>
                </div>

                <div className="englishtaCourseEnrollModal__benefits">
                  <span><i className="fa-solid fa-circle-check" />Reserve your seat instantly</span>
                  <span><i className="fa-solid fa-circle-check" />Personal guidance call</span>
                  <span><i className="fa-solid fa-circle-check" />Batch preference support</span>
                  <span><i className="fa-solid fa-circle-check" />Flexible payment options</span>
                </div>
              </section>

              <section className="englishtaCourseEnrollModal__payment">
                <h3>Payment Details</h3>
                <div className="englishtaCourseEnrollModal__amountCard">
                  <span>Advance Booking Amount</span>
                  <strong>₹{advanceBookingAmount}</strong>
                  <hr />
                  <span>Remaining Amount</span>
                  <p>
                    {remainingAmount ? `₹${remainingAmount}` : "Pay after counsellor confirmation"}
                  </p>
                </div>

                <p className="englishtaCourseEnrollModal__secure">
                  <i className="fa-solid fa-lock" />
                  Secure &amp; Safe Payment
                </p>

                {enrollFeedback.message ? (
                  <p className={`englishtaCourseEnrollModal__feedback ${enrollFeedback.type}`}>
                    {enrollFeedback.message}
                  </p>
                ) : null}

                <button
                  type="button"
                  className="englishtaCourseEnrollModal__reserve"
                  onClick={handleCourseEnrollment}
                  disabled={isEnrolling}
                >
                  <i className="fa-solid fa-lock" />
                  {isEnrolling
                    ? "Opening Payment..."
                    : isCurrentUserEnrolled
                      ? `Pay \u20b9${advanceBookingAmount} & Confirm Payment`
                      : `Pay ₹${advanceBookingAmount} & Reserve Seat`}
                </button>

                <small>Your seat will be reserved after successful payment.</small>
              </section>
            </div>
          </div>
        </div>
      ) : null}
      {isSuccessModalOpen ? (
        <div className="englishtaWebinarModal" onClick={closeSuccessModal}>
          <div
            className="englishtaWebinarModal__dialog englishtaWebinarModal__dialog--success"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-success-title"
          >
            <button type="button" className="englishtaWebinarModal__close" onClick={closeSuccessModal}>
              <i className="fa-solid fa-xmark" />
            </button>
            <div className="englishtaWebinarModal__successIcon">
              <i className="fa-solid fa-check" />
            </div>
            <div className="englishtaWebinarModal__head englishtaWebinarModal__head--success">
              <p>{successModalContent.eyebrow}</p>
              <h2 id="course-success-title">{successModalContent.title}</h2>
            </div>
            <p className="englishtaWebinarModal__successText">
              {successModalContent.message}
            </p>
            {successModalContent.actionHref ? (
              <Link href={successModalContent.actionHref} className="englishtaWebinarModal__submit" onClick={closeSuccessModal}>
                {successModalContent.actionLabel}
                <i className="fa-solid fa-arrow-right" />
              </Link>
            ) : (
              <button type="button" className="englishtaWebinarModal__submit" onClick={closeSuccessModal}>
                {successModalContent.actionLabel}
                <i className="fa-solid fa-arrow-right" />
              </button>
            )}
          </div>
        </div>
      ) : null}
      <Footer />
    </>
  );
};

export default CourseDetailPage;
