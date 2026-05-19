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

const batchTypeMeta = {
  beginners: {
    label: "Beginners-Promise Batch",
    icon: "fa-solid fa-user-graduate",
    theme: "yellow",
    subtitle: "Perfect for beginners who hesitate while speaking English.",
  },
  advanced: {
    label: "Advanced-Confidence Batch",
    icon: "fa-solid fa-person-rays",
    theme: "orange",
    subtitle: "Build confidence and improve fluency.",
  },
  speakers: {
    label: "Speakers-Expression Batch",
    icon: "fa-solid fa-people-arrows",
    theme: "purple",
    subtitle: "Learn natural speaking styles and expressions.",
  },
  interview: {
    label: "Interview Preparation Batch",
    icon: "fa-solid fa-user-tie",
    theme: "blue",
    subtitle: "Prepare confidently for interviews and professional communication.",
  },
  grammar: {
    label: "Grammar-Academics Batch",
    icon: "fa-solid fa-book-open",
    theme: "green",
    subtitle: "Strengthen your grammar and academic English.",
  },
  super5: {
    label: "Super 5 Live Batch",
    icon: "fa-solid fa-crown",
    theme: "yellow",
    subtitle: "Premium small-group learning with maximum personal attention.",
  },
  oneOnOne: {
    label: "One On One Live Batch",
    icon: "fa-solid fa-user-shield",
    theme: "dark",
    subtitle: "Personal English coaching tailored to your goals.",
  },
};

const languageLabels = {
  marathi: "Marathi",
  hindi: "Hindi",
  english: "English",
};

const defaultBenefits = ["Early Bird Offer", "Free Speaking Club", "Bonus PDFs", "WhatsApp Group"];

const whatYouGetItems = [
  ["fa-solid fa-gift", "Early Bird Offer"],
  ["fa-solid fa-comments", "Free Speaking Club"],
  ["fa-solid fa-file-pdf", "Bonus PDFs"],
  ["fa-solid fa-clipboard-list", "Interview Toolkit"],
  ["fa-brands fa-whatsapp", "WhatsApp Practice Group"],
];

const defaultLiveBatchTypes = ["beginners", "advanced", "speakers", "interview", "grammar", "super5", "oneOnOne"];

function normalizeCourse(course) {
  const batchType = course.batchType || "beginners";
  const meta = batchTypeMeta[batchType] || batchTypeMeta.beginners;
  const cardTitle = course.cardTitle || meta.label;
  const cardSubtitle = course.cardSubtitle || course.shortDescription || meta.subtitle;
  const benefits = Array.isArray(course.benefits) && course.benefits.length ? course.benefits : defaultBenefits;
  const languages = Array.isArray(course.languages) && course.languages.length
    ? course.languages
    : ["marathi", "hindi", "english"];

  return {
    ...course,
    batchType,
    courseMode: course.courseMode || "live",
    cardTitle,
    cardSubtitle,
    benefits,
    languages,
    icon: course.icon || meta.icon,
    theme: course.theme || meta.theme,
    isPremium: Boolean(course.isPremium) || batchType === "oneOnOne",
    sortOrder: Number.isFinite(Number(course.sortOrder)) ? Number(course.sortOrder) : 0,
  };
}

const getFallbackCourses = () =>
  defaultLiveBatchTypes.map((batchType, index) =>
    normalizeCourse({
      _id: `fallback-${batchType}`,
      name: batchTypeMeta[batchType].label,
      batchType,
      courseMode: "live",
      visible: "Yes",
      sortOrder: index + 1,
      benefits: defaultBenefits,
      languages: ["marathi", "hindi", "english"],
      isFallback: true,
    }),
  );

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
      return adminCourses.sort((first, second) => first.sortOrder - second.sortOrder);
    }

    const fallbackCourses = getFallbackCourses();
    const coursesByBatch = new Map(fallbackCourses.map((course) => [course.batchType, course]));

    adminCourses.forEach((course) => {
      coursesByBatch.set(course.batchType, course);
    });

    return Array.from(coursesByBatch.values()).sort((first, second) => first.sortOrder - second.sortOrder);
  }, [activeMode, visibleCourses]);

  const activeModeDetails = courseModeDetails[activeMode];
  const diagnosticDetails = diagnostics?.diagnostics;
  const shouldShowDiagnostics = !loading && diagnostics && (error || courses.length === 0);

  return (
    <>
      <Navbar />
      <main className="englishtaCoursesPage englishtaCoursesPage--catalog">
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

            <div className="englishtaCourseModeHead">
              <i className={activeModeDetails.icon} />
              <div>
                <h2>{activeModeDetails.title}</h2>
                <p>{activeModeDetails.text}</p>
              </div>
            </div>

            {loading ? (
              <div className="englishtaCourseCatalogGrid">
                {[1, 2, 3, 4].map((item) => (
                  <div className="englishtaCourseTile englishtaCourseTile--loading" key={item}>
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

                <div className="englishtaCourseCatalogGrid">
                  {activeCourses.map((course, index) => {
                    const slug = slugifyCourseName(course.name);
                    const courseNumber = index + 1;

                    return (
                      <Link
                        href={course.isFallback ? "/contact-us" : `/course/${slug}`}
                        className={`englishtaCourseTile englishtaCourseTile--${course.theme} ${
                          course.isPremium ? "englishtaCourseTile--premium" : ""
                        }`}
                        key={course._id ?? slug}
                      >
                        {course.isPremium || course.badge ? (
                          <span className="englishtaCourseTile__badge">{course.badge || "Premium"}</span>
                        ) : null}
                        <span className="englishtaCourseTile__number">{courseNumber}</span>
                        <span className="englishtaCourseTile__icon">
                          <i className={course.icon} />
                        </span>
                        <strong>{course.cardTitle}</strong>
                        <span className="englishtaCourseTile__text">{course.cardSubtitle}</span>
                        <span className="englishtaCourseTile__chips">
                          {course.benefits.slice(0, 4).map((benefit) => (
                            <span key={benefit}>{benefit}</span>
                          ))}
                        </span>
                        <span className="englishtaCourseTile__languages">
                          Language: {course.languages.map((language) => languageLabels[language] || language).join(" + ")}
                        </span>
                      </Link>
                    );
                  })}

                  <aside className="englishtaCourseBenefits">
                    <h3>
                      <i className="fa-solid fa-gift" />
                      What You Get
                    </h3>
                    <ul>
                      {whatYouGetItems.map(([icon, label]) => (
                        <li key={label}>
                          <i className={icon} />
                          <span>{label}</span>
                        </li>
                      ))}
                    </ul>
                  </aside>
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
