"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const languageLabels = {
  marathi: "Marathi",
  hindi: "Hindi",
  english: "English",
};

const modeLabels = {
  live: "Live Course",
  recorded: "Recorded Course",
  audio: "Audio Course",
  progress: "Progress Course",
};

const slugifyCourseName = (name = "") =>
  name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function clampPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function normalizePrice(price) {
  const normalizedPrice = String(price || "").trim();
  if (!normalizedPrice) return "";
  if (normalizedPrice.toLowerCase().startsWith("rs") || normalizedPrice.startsWith("₹")) {
    return normalizedPrice;
  }
  return `₹${normalizedPrice}`;
}

function JoinedCourseCard({ enrollment }) {
  const course = enrollment.course;
  const progress = clampPercent(enrollment.progressPercentage);
  const slug = slugifyCourseName(course.name);
  const fees = normalizePrice(course.discountedPrice || course.price || course.actualPrice);
  const languages = Array.isArray(course.languages) && course.languages.length
    ? course.languages
    : ["marathi", "hindi", "english"];

  return (
    <article className="englishtaJoinedCourseCard">
      <Link href={`/course/${slug}`} className="englishtaJoinedCourseCard__image">
        <img src={course.thumbnail || "/assets/images/aboutenglishta.png"} alt={course.name} />
        <span>{modeLabels[course.courseMode] || "Course"}</span>
      </Link>

      <div className="englishtaJoinedCourseCard__body">
        <div className="englishtaJoinedCourseCard__meta">
          <span>
            <i className="fa-regular fa-calendar-check" />
            Joined {formatDate(enrollment.joinedAt)}
          </span>
          <span>
            <i className="fa-solid fa-language" />
            {languages.map((language) => languageLabels[language] || language).join(" + ")}
          </span>
        </div>

        <h2>{course.name}</h2>
        <p>{course.shortDescription || "Continue your English learning journey with Englishta."}</p>

        <div className="englishtaJoinedCourseCard__progress">
          <div>
            <span>Course Progress</span>
            <strong>{progress}%</strong>
          </div>
          <em>
            <i style={{ width: `${progress}%` }} />
          </em>
        </div>

        <div className="englishtaJoinedCourseCard__footer">
          <span>{fees ? `Fees: ${fees}` : "Fees: Contact Us"}</span>
          <Link href="/my-progress">
            View Progress <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function JoinedCoursesPage() {
  const [joinedCourses, setJoinedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    let mounted = true;

    fetch("/api/my-courses", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();

        if (response.status === 401) {
          setIsUnauthorized(true);
          return [];
        }

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "Unable to load joined courses.");
        }

        return payload.data || [];
      })
      .then((courses) => {
        if (!mounted) return;
        setJoinedCourses(courses);
      })
      .catch((fetchError) => {
        if (!mounted) return;
        setError(fetchError.message || "Unable to load joined courses.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const completedCount = useMemo(
    () => joinedCourses.filter((item) => item.completed).length,
    [joinedCourses],
  );

  const openLogin = () => {
    window.dispatchEvent(
      new CustomEvent("englishta:protected-navigation", {
        detail: { href: "/joined-courses" },
      }),
    );
  };

  return (
    <>
      <Navbar />
      <main className="englishtaJoinedCoursesPage">
        <section className="englishtaJoinedCoursesHero">
          <div className="container">
            <p>My Learning</p>
            <h1>Joined Courses</h1>
            <span>Continue the courses you have enrolled in and track your learning progress.</span>
          </div>
        </section>

        <section className="englishtaJoinedCoursesContent">
          <div className="container">
            {loading ? (
              <div className="englishtaJoinedCoursesNotice">Loading your joined courses...</div>
            ) : null}

            {!loading && isUnauthorized ? (
              <div className="englishtaJoinedCoursesEmpty">
                <i className="fa-solid fa-lock" />
                <h2>Login to view your joined courses</h2>
                <p>Your enrolled courses are connected to your student account.</p>
                <button type="button" onClick={openLogin}>Login / Register</button>
              </div>
            ) : null}

            {!loading && !isUnauthorized && error ? (
              <div className="englishtaJoinedCoursesNotice error">{error}</div>
            ) : null}

            {!loading && !isUnauthorized && !error && joinedCourses.length === 0 ? (
              <div className="englishtaJoinedCoursesEmpty">
                <i className="fa-solid fa-book-open" />
                <h2>No joined courses yet</h2>
                <p>Explore available English courses and enroll to see them here.</p>
                <Link href="/courses">Explore Courses</Link>
              </div>
            ) : null}

            {!loading && !isUnauthorized && !error && joinedCourses.length > 0 ? (
              <>
                <div className="englishtaJoinedCoursesStats">
                  <article>
                    <span>Total Joined</span>
                    <strong>{joinedCourses.length}</strong>
                  </article>
                  <article>
                    <span>Completed</span>
                    <strong>{completedCount}</strong>
                  </article>
                  <article>
                    <span>In Progress</span>
                    <strong>{joinedCourses.length - completedCount}</strong>
                  </article>
                </div>

                <div className="englishtaJoinedCoursesGrid">
                  {joinedCourses.map((enrollment) => (
                    <JoinedCourseCard
                      enrollment={enrollment}
                      key={`${enrollment.course._id}-${enrollment.joinedAt || ""}`}
                    />
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
}
