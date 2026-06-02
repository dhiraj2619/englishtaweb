"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  ["progress", "Track Your Progress", "fa-solid fa-chart-line"],
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
    title: "Track Your Progress",
    text: "Track your speaking confidence, grammar, and fluency growth",
    icon: "fa-solid fa-chart-line",
  },
};

const languageLabels = {
  marathi: "Marathi",
  hindi: "Hindi",
  english: "English",
};

const recommendationCopy = {
  beginner: {
    title: "Recommended for your score: Beginners - Promise Batch",
    text: "Start with confidence, basic grammar, vocabulary, and guided speaking practice.",
    keywords: ["beginner", "promise", "basic"],
  },
  intermediate: {
    title: "Recommended for your score: Advanced Confidence Batch",
    text: "Build stronger fluency, sentence flow, and confidence in real conversations.",
    keywords: ["advanced", "confidence", "speaker", "expression"],
  },
  advanced: {
    title: "Recommended for your score: Interview or One On One Batch",
    text: "Sharpen professional communication, interviews, expression, and personal fluency.",
    keywords: ["interview", "one on one", "super", "professional"],
  },
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

const normalizePrice = (price) => {
  const normalizedPrice = String(price).trim();
  const lowerPrice = normalizedPrice.toLowerCase();

  if (lowerPrice.startsWith("rs") || normalizedPrice.startsWith("\u20b9")) {
    return normalizedPrice;
  }

  return `\u20b9${normalizedPrice}`;
};

const getCourseFees = (course) => {
  const discountedPrice = course.discountedPrice || course.price;
  const actualPrice = course.actualPrice;

  if (!discountedPrice && !actualPrice) {
    return null;
  }

  return {
    actual: actualPrice ? normalizePrice(actualPrice) : "",
    discounted: discountedPrice ? normalizePrice(discountedPrice) : normalizePrice(actualPrice),
  };
};
function CourseCard({ course, index }) {
  const slug = slugifyCourseName(course.name);
  const fees = getCourseFees(course);
  const detailHref = course.isFallback ? "/contact-us" : `/course/${slug}`;
  const actionHref = detailHref;
  const courseLanguageLabel = course.languages.map((language) => languageLabels[language] || language).join(" + ");
  const hasFees = Boolean(fees?.discounted);

  return (
    <article className="englishtaCourseCard englishtaCourseCard--feature">
      <Link href={detailHref} className="englishtaCourseCard__image englishtaCourseCard__image--feature">
        <img src={getCourseImage(course, index)} alt={course.name} />
      </Link>

      <div className="englishtaCourseCard__body englishtaCourseCard__body--feature">
        <div className="englishtaCourseCard__topline">
          <span className="englishtaCourseCard__tag">Language: {courseLanguageLabel}</span>
          <a className="englishtaCourseCard__whatsApp" href="/contact-us" aria-label="Open WhatsApp or contact">
            <i className="fa-brands fa-whatsapp" aria-hidden="true" />
          </a>
        </div>

        <h4>{course.name}</h4>

        <div className="englishtaCourseCard__priceRow">
          <span className="englishtaCourseCard__price">
            {hasFees ? (
              <>
                <strong>Investment: {fees.discounted}</strong>
                {fees.actual ? <del>{fees.actual}</del> : null}
              </>
            ) : (
              <strong>Investment: Contact Us</strong>
            )}
          </span>
          <span className="englishtaCourseCard__students">
            <i className="fa-solid fa-users" aria-hidden="true" />
            {course.studentsEnrolled ? `${course.studentsEnrolled} Students` : "12 Students"}
          </span>
        </div>

        <span className="englishtaCourseCard__discount">
          <i className="fa-solid fa-tag" aria-hidden="true" />
          Discount of 13% applied
        </span>

        <div className="englishtaCourseCard__actions">
          <Link href={actionHref} className="englishtaCourseCard__button englishtaCourseCard__button--solid">
            {course.isFallback ? "Enquire Now" : "Join Now"}
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

const CoursesPageContent = () => {
  const searchParams = useSearchParams();
  const recommendedLevel = searchParams.get("recommended");
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

  const recommendation = recommendationCopy[recommendedLevel] || null;

  const recommendedCourses = useMemo(() => {
    if (!recommendation) return [];

    const coursesToSearch = activeCourses.length ? activeCourses : visibleCourses;
    const matches = coursesToSearch.filter((course) => {
      const name = String(course.name || "").toLowerCase();
      const description = String(course.shortDescription || "").toLowerCase();

      return recommendation.keywords.some((keyword) => name.includes(keyword) || description.includes(keyword));
    });

    return matches.length ? matches : coursesToSearch.slice(0, 1);
  }, [activeCourses, recommendation, visibleCourses]);

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

            {recommendation ? (
              <div className="englishtaRecommendedCourse">
                <div>
                  <p>Your Suitable Course</p>
                  <h2>{recommendation.title}</h2>
                  <span>{recommendation.text}</span>
                </div>
                <a href="#recommended-courses">View Recommendation</a>
              </div>
            ) : null}

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

            {recommendation && recommendedCourses.length ? (
              <div className="englishtaCoursesRecommendedBlock" id="recommended-courses">
                <h2>Best Match For You</h2>
                <div className="englishtaCoursesGrid">
                  {recommendedCourses.map((course, index) => (
                    <CourseCard course={course} index={index} key={`recommended-${course._id ?? course.name}`} />
                  ))}
                </div>
              </div>
            ) : null}

            {!recommendation && loading ? (
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

            {!recommendation && !loading && !error ? (
              <>
                {activeCourses.length === 0 ? (
                  <div className="englishtaCoursesNotice wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s">
                    Coming soon
                  </div>
                ) : null}

                <div className="englishtaCoursesGrid">
                  {activeCourses.map((course, index) => (
                    <CourseCard course={course} index={index} key={course._id ?? slugifyCourseName(course.name)} />
                  ))}
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

const CoursesPage = () => (
  <Suspense
    fallback={
      <>
        <Navbar />
        <main className="englishtaCoursesPage englishtaCoursesPage--catalog">
          <section className="englishtaCoursesHero">
            <div className="container">
              <p>English Speaking Courses</p>
              <h1>Choose the Right English Course for Your Confidence</h1>
              <div className="englishtaCoursesHero__stats" aria-label="Course highlights">
                <span>Live Online Sessions</span>
                <span>Marathi + Hindi + English</span>
                <span>Expert Tutor Feedback</span>
              </div>
            </div>
          </section>
          <section className="englishtaCourseCatalog">
            <div className="container">
              <div className="englishtaCoursesNotice">Loading courses...</div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    }
  >
    <CoursesPageContent />
  </Suspense>
);

export default CoursesPage;

