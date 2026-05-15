"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  const hasRichSyllabus = /<\/?(h[1-6]|ul|ol|li|p|strong|em|br)\b/i.test(rawSyllabus);
  const syllabusHtml = sanitizeCourseHtml(rawSyllabus);
  const syllabusItems = splitSyllabus(rawSyllabus);

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
                      <Link href="/contact-us" className="englishtaCourseDetailHero__primary">
                        Book Free Demo
                      </Link>
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
                    <p>{course.longDescription}</p>
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
                  <Link href="/contact-us">Join Free Demo Class</Link>
                  <span>Flexible online batches available</span>
                </aside>
              </div>
            </section>
          </>
        ) : null}
      </main>
      <Footer />
    </>
  );
};

export default CourseDetailPage;
