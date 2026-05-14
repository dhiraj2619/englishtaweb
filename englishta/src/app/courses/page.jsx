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

  useEffect(() => {
    let isMounted = true;

    fetch("/api/courses", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => {
        if (!isMounted) return;

        if (!payload.success) {
          throw new Error(payload.message || "Failed to load courses.");
        }

        setCourses(payload.data ?? []);
      })
      .catch((fetchError) => {
        if (isMounted) {
          setError(fetchError.message || "Failed to load courses.");
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

  return (
    <>
      <Navbar />
      <main className="englishtaCoursesPage">
        <section className="englishtaCoursesHero">
          <div className="container">
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
                  <div className="englishtaCourseCard englishtaCourseCard--loading" key={item}>
                    <span />
                    <div />
                    <strong />
                    <p />
                  </div>
                ))}
              </div>
            ) : null}

            {!loading && error ? <div className="englishtaCoursesNotice">{error}</div> : null}

            {!loading && !error && courses.length === 0 ? (
              <div className="englishtaCoursesNotice">
                Courses added from admin will appear here.
              </div>
            ) : null}

            {!loading && !error && courses.length > 0 ? (
              <div className="englishtaCoursesGrid">
                {courses.map((course) => {
                  const slug = slugifyCourseName(course.name);

                  return (
                    <Link className="englishtaCourseCard" href={`/course/${slug}`} key={course._id ?? slug}>
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
