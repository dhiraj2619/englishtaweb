"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
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

const CourseDetailPage = () => {
  const { slug } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const course = useMemo(
    () => courses.find((item) => slugifyCourseName(item.name) === slug),
    [courses, slug],
  );

  const rawSyllabus = course?.syllabus ?? "";
  const rawLongDescription = course?.longDescription ?? "";
  const hasRichLongDescription = /<\/?(h[1-6]|ul|ol|li|p|strong|em|br|blockquote)\b/i.test(rawLongDescription);
  const longDescriptionHtml = sanitizeCourseHtml(rawLongDescription);
  const hasRichSyllabus = /<\/?(h[1-6]|ul|ol|li|p|strong|em|br)\b/i.test(rawSyllabus);
  const syllabusHtml = sanitizeCourseHtml(rawSyllabus);
  const syllabusItems = splitSyllabus(rawSyllabus);

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
                    {course.allowBooking === "Yes" ? (
                      <button type="button" className="englishtaCourseDetailHero__primary" onClick={openJoinModal}>
                        Book Free Demo
                      </button>
                    ) : null}
                    <a href="#syllabus" className="englishtaCourseDetailHero__secondary">
                      View Syllabus
                    </a>
                  </div>
                </div>
                <div className="englishtaCourseDetailHero__media wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.25s">
                  <img src={course.thumbnail} alt={course.name} />
                  <div>
                    <strong>Starting from {course.price}</strong>
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
                  <p>Tell us your goal and we will suggest the right English practice plan.</p>
                  <button type="button" onClick={openJoinModal}>Register Now</button>
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
              <p>Course Lead Submitted</p>
              <h2 id="course-success-title">Thank you for your response</h2>
            </div>
            <p className="englishtaWebinarModal__successText">
              We have received your request and will contact you soon.
            </p>
            <button type="button" className="englishtaWebinarModal__submit" onClick={closeSuccessModal}>
              Close
              <i className="fa-solid fa-arrow-right" />
            </button>
          </div>
        </div>
      ) : null}
      <Footer />
    </>
  );
};

export default CourseDetailPage;
