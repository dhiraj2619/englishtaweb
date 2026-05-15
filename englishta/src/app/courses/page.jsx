"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const slugifyCourseName = (name = "") =>
  name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [diagnostics, setDiagnostics] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadDiagnostics = async () => {
      try {
        const response = await fetch("/api/debug/database", { cache: "no-store" });
        const payload = await response.json();

        if (isMounted) {
          setDiagnostics(payload);
        }
      } catch (diagnosticError) {
        if (isMounted) {
          setDiagnostics({
            success: false,
            message: "Could not load database diagnostics.",
            diagnostics: {
              error: {
                name: diagnosticError.name,
                message: diagnosticError.message,
              },
            },
          });
        }
      }
    };

    fetch("/api/courses", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => {
        if (!isMounted) return;

        if (!payload.success) {
          throw new Error(payload.message || "Failed to load courses.");
        }

        const nextCourses = payload.data ?? [];
        setCourses(nextCourses);

        if (nextCourses.length === 0) {
          loadDiagnostics();
        }
      })
      .catch((fetchError) => {
        if (isMounted) {
          setError(fetchError.message || "Failed to load courses.");
          loadDiagnostics();
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

  const totalStudents = useMemo(
    () =>
      courses.reduce((total, course) => {
        const count = Number.parseInt(String(course.studentsEnrolled ?? "0").replace(/\D/g, ""), 10);
        return total + (Number.isNaN(count) ? 0 : count);
      }, 0),
    [courses],
  );

  const diagnosticDetails = diagnostics?.diagnostics;
  const shouldShowDiagnostics = !loading && diagnostics && (error || courses.length === 0);

  return (
    <>
      <Navbar />
      <main className="englishtaCoursesPage">
        <section className="englishtaCoursesHero">
          <div className="container wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.15s">
            <p>Online English Speaking Courses</p>
            <h1>Choose the course that fits your English goal</h1>
            <div className="englishtaCoursesHero__stats">
              <span>{courses.length || "Live"} courses</span>
              <span>{totalStudents ? `${totalStudents}+ learners` : "Personal feedback"}</span>
              <span>Demo class available</span>
            </div>
          </div>
        </section>

        <section className="englishtaCoursesList">
          <div className="container">
            {loading ? (
              <div className="englishtaCoursesGrid">
                {[1, 2, 3].map((item) => (
                  <div
                    className="englishtaCourseCard englishtaCourseCard--loading wow fadeInUp"
                    data-wow-duration="1s"
                    data-wow-delay={`${0.12 + item * 0.08}s`}
                    key={item}
                  >
                    <span />
                    <div />
                    <strong />
                    <p />
                  </div>
                ))}
              </div>
            ) : null}

            {!loading && error ? (
              <div className="englishtaCoursesNotice wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s">
                {error}
              </div>
            ) : null}

            {!loading && !error && courses.length === 0 ? (
              <div className="englishtaCoursesNotice wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s">
                Courses added from admin will appear here.
              </div>
            ) : null}

            {shouldShowDiagnostics ? (
              <div className="englishtaCoursesDebug wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.15s">
                <strong>Production database check</strong>
                <p>{diagnostics.message}</p>
                <dl>
                  <div>
                    <dt>MONGODB_URI added</dt>
                    <dd>{diagnosticDetails?.env?.mongodbUriPresent ? "Yes" : "No"}</dd>
                  </div>
                  <div>
                    <dt>MONGODB_DB</dt>
                    <dd>{diagnosticDetails?.env?.mongodbDb || "Not set"}</dd>
                  </div>
                  <div>
                    <dt>Mongo host</dt>
                    <dd>{diagnosticDetails?.env?.mongodbHost || "Not available"}</dd>
                  </div>
                  <div>
                    <dt>Ready state</dt>
                    <dd>{diagnosticDetails?.mongooseReadyState ?? "Unknown"}</dd>
                  </div>
                  <div>
                    <dt>Course records</dt>
                    <dd>{diagnosticDetails?.counts?.courses ?? "Unknown"}</dd>
                  </div>
                  <div>
                    <dt>Video records</dt>
                    <dd>{diagnosticDetails?.counts?.videos ?? "Unknown"}</dd>
                  </div>
                </dl>
                {diagnosticDetails?.error ? (
                  <p className="englishtaCoursesDebug__error">
                    {diagnosticDetails.error.name}: {diagnosticDetails.error.message}
                  </p>
                ) : null}
                <span>Open /api/debug/database on production for the full safe diagnostic response.</span>
              </div>
            ) : null}

            {!loading && !error && courses.length > 0 ? (
              <div className="englishtaCoursesGrid">
                {courses.map((course, index) => {
                  const slug = slugifyCourseName(course.name);

                  return (
                    <Link
                      className="englishtaCourseCard wow fadeInUp"
                      data-wow-duration="1s"
                      data-wow-delay={`${0.12 + (index % 3) * 0.1}s`}
                      href={`/course/${slug}`}
                      key={course._id ?? slug}
                    >
                      <span className="englishtaCourseCard__image">
                        <img src={course.thumbnail} alt={course.name} />
                        <span>{course.allowBooking === "Yes" ? "Booking Open" : "View Details"}</span>
                      </span>
                      <span className="englishtaCourseCard__body">
                        <span className="englishtaCourseCard__tag">Online English Course</span>
                        <strong>{course.name}</strong>
                        <span className="englishtaCourseCard__desc">{course.shortDescription}</span>
                        <span className="englishtaCourseCard__meta">
                          <span>Starting from {course.price}</span>
                          <span>{course.studentsEnrolled} learners</span>
                        </span>
                        <span className="englishtaCourseCard__action">
                          View course
                          <i className="fa-solid fa-arrow-right" />
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CoursesPage;
