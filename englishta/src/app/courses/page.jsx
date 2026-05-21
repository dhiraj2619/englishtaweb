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

const courseModeTabs = [
  ["live", "Live Courses", "fa-solid fa-tower-broadcast"],
  ["recorded", "Recorded Courses", "fa-regular fa-circle-play"],
  ["audio", "Audio Course", "fa-solid fa-headphones-simple"],
  ["progress", "Check Your Progress", "fa-solid fa-chart-line"],
];

const courseModeDetails = {
  live: {
    title: "Live Courses",
    text: "Live interaction, real-time feedback & personal attention",
    icon: "fa-solid fa-tower-broadcast",
  },
  recorded: {
    title: "Recorded Courses",
    text: "Flexible self-paced lessons you can revisit anytime",
    icon: "fa-regular fa-circle-play",
  },
  audio: {
    title: "Audio Course",
    text: "Listen, repeat, and improve pronunciation on the go",
    icon: "fa-solid fa-headphones-simple",
  },
  progress: {
    title: "Check Your Progress",
    text: "Track your speaking confidence, grammar, and fluency growth",
    icon: "fa-solid fa-chart-line",
  },
};

const languageLabels = {
  marathi: "Marathi",
  hindi: "Hindi",
  english: "English",
};

const defaultLiveCourses = [
  ["Beginners-Promise Batch", "Perfect for beginners who hesitate while speaking English."],
  ["Advanced-Confidence Batch", "Build confidence and improve fluency."],
  ["Speakers-Expression Batch", "Learn natural speaking styles and expressions."],
  ["Interview Preparation Batch", "Prepare confidently for interviews and professional communication."],
  ["Grammar-Academics Batch", "Strengthen your grammar and academic English."],
  ["Super 5 Live Batch", "Premium small-group learning with maximum personal attention."],
  ["One On One Live Batch", "Personal English coaching tailored to your goals."],
];

function normalizeCourse(course) {
  const languages = Array.isArray(course.languages) && course.languages.length
    ? course.languages
    : ["marathi", "hindi", "english"];

  return {
    ...course,
    courseMode: course.courseMode || "live",
    languages,
  };
}

const getFallbackCourses = () =>
  defaultLiveCourses.map(([name, shortDescription], index) =>
    normalizeCourse({
      _id: `fallback-live-${index}`,
      name,
      shortDescription,
      courseMode: "live",
      visible: "Yes",
      languages: ["marathi", "hindi", "english"],
      isFallback: true,
    }),
  );

const getCourseImage = (course, index) =>
  course.thumbnail || `https://picsum.photos/seed/englishta-course-${index}/900/600`;

const formatCourseFees = (price) => {
  if (!price) return "Fees: Contact Us";
  const normalizedPrice = String(price).trim();

  if (/^(rs\.?|₹)/i.test(normalizedPrice)) {
    return `Fees: ${normalizedPrice}`;
  }

  return `Fees: ₹${normalizedPrice}`;
};

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [activeMode, setActiveMode] = useState("live");
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

        const nextCourses = (payload.data ?? []).map(normalizeCourse);
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

  const visibleCourses = useMemo(
    () => courses.filter((course) => course.visible !== "No"),
    [courses],
  );

  const activeCourses = useMemo(() => {
    const adminCourses = visibleCourses.filter((course) => course.courseMode === activeMode);

    if (activeMode !== "live") {
      return adminCourses;
    }

    return adminCourses.length ? adminCourses : getFallbackCourses();
  }, [activeMode, visibleCourses]);

  const diagnosticDetails = diagnostics?.diagnostics;
  const shouldShowDiagnostics = !loading && diagnostics && (error || courses.length === 0);

  return (
    <>
      <Navbar />
      <main className="englishtaCoursesPage englishtaCoursesPage--catalog">
        <section className="englishtaCoursesHero">
          <div className="container">
            <p>English Speaking Courses</p>
            <h1>
              Choose the Right English Course for Your Confidence
            </h1>
            <div className="englishtaCoursesHero__stats" aria-label="Course highlights">
              <span>Live Online Sessions</span>
              <span>Marathi + Hindi + English</span>
              <span>Expert Tutor Feedback</span>
            </div>
          </div>
        </section>

        <section className="englishtaCourseCatalog">
          <div className="container">
            <div className="englishtaCourseCatalog__head wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s">
              <p>Popular Courses</p>
              <h1>Choose Your Course</h1>
              <span aria-hidden="true" />
            </div>

            <div className="englishtaCourseModeTabs" role="tablist" aria-label="Course modes">
              {courseModeTabs.map(([value, label, icon]) => (
                <button
                  type="button"
                  className={activeMode === value ? "isActive" : ""}
                  onClick={() => setActiveMode(value)}
                  role="tab"
                  aria-selected={activeMode === value}
                  key={value}
                >
                  <i className={icon} />
                  {label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="englishtaCoursesGrid">
                {[1, 2, 3, 4].map((item) => (
                  <div className="englishtaCourseCard englishtaCourseCard--loading" key={item}>
                    <span />
                    <strong />
                    <p />
                    <div />
                  </div>
                ))}
              </div>
            ) : null}

            {!loading && error ? (
              <div className="englishtaCoursesNotice wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s">
                {error}
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
                    <dt>Course records</dt>
                    <dd>{diagnosticDetails?.counts?.courses ?? "Unknown"}</dd>
                  </div>
                </dl>
                {diagnosticDetails?.error ? (
                  <p className="englishtaCoursesDebug__error">
                    {diagnosticDetails.error.name}: {diagnosticDetails.error.message}
                  </p>
                ) : null}
              </div>
            ) : null}

            {!loading && !error ? (
              <>
                {activeCourses.length === 0 ? (
                  <div className="englishtaCoursesNotice wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s">
                    No courses found in this section.
                  </div>
                ) : null}

                <div className="englishtaCoursesGrid">
                  {activeCourses.map((course, index) => {
                    const slug = slugifyCourseName(course.name);

                    return (
                      <Link
                        href={course.isFallback ? "/contact-us" : `/course/${slug}`}
                        className="englishtaCourseCard"
                        key={course._id ?? slug}
                      >
                        <span className="englishtaCourseCard__image">
                          <img src={getCourseImage(course, index)} alt={course.name} />
                          <span>{courseModeDetails[course.courseMode]?.title || "Course"}</span>
                        </span>
                        <span className="englishtaCourseCard__body">
                          <span className="englishtaCourseCard__tag">
                            Language: {course.languages.map((language) => languageLabels[language] || language).join(" + ")}
                          </span>
                          <strong>{course.name}</strong>
                        
                          <span className="englishtaCourseCard__meta">
                            <span>{formatCourseFees(course.price)}</span>
                            <span>{course.studentsEnrolled ? `${course.studentsEnrolled} Students` : "Live Batch"}</span>
                          </span>
                          <span className="englishtaCourseCard__action">
                            {course.isFallback ? "Enquire Now" : "View Course"}
                            <i className="fa-solid fa-arrow-right" />
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CoursesPage;
