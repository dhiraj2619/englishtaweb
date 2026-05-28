"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const sidebarLinks = [
  { href: "/joined-courses", icon: "fa-regular fa-book-open", label: "Joined Courses" },
  { href: "/student-profile", icon: "fa-solid fa-user", label: "Student Profile", active: true },
  { href: "/my-progress", icon: "fa-solid fa-chart-line", label: "My Progress" },
];

const learningSteps = [
  {
    id: "personal",
    badge: "1",
    accent: "green",
    title: "Personal Details",
    description: "Tell us about yourself and your learning goals.",
    bullets: ["Basic Information", "Learning Goals", "Daily Practice Time"],
    ctaIcon: "fa-solid fa-check",
  },
  {
    id: "skills",
    badge: "2",
    accent: "amber",
    title: "Test Your Skills Now",
    description: "Take a quick test to find your current English level.",
    bullets: ["Speaking Assessment", "Vocabulary Test", "Confidence Check"],
    cta: "Test English Skills",
    ctaHref: "/courses",
    ctaIcon: "fa-solid fa-arrow-right",
  },
  {
    id: "course",
    badge: "3",
    accent: "purple",
    title: "Which Course Fits You?",
    description: "Answer a few questions and we will recommend the best course for you.",
    bullets: ["Your Goals", "Learning Preferences", "Best Course Recommendation"],
    cta: "Find My Course",
    ctaHref: "/courses",
    ctaIcon: "fa-solid fa-arrow-right",
  },
];

const quickHighlights = [
  { icon: "fa-solid fa-list-check", label: "Personalized Dashboard" },
  { icon: "fa-solid fa-user-group", label: "Smart Course Recommendations" },
  { icon: "fa-regular fa-clock", label: "Detailed Progress Tracking" },
  { icon: "fa-regular fa-clipboard", label: "Practice & Test Access" },
];

const personalFields = [
  { key: "gender", label: "Gender", type: "select", options: ["", "male", "female", "other"] },
  { key: "dateOfBirth", label: "Date of Birth", type: "date" },
  { key: "city", label: "City", type: "text" },
  { key: "state", label: "State", type: "text" },
  { key: "profession", label: "Profession", type: "text" },
];

function formatLearningGoal(goal) {
  const labels = {
    "spoken-english": "Spoken English",
    "job-interview": "Job Interview",
    "business-english": "Business English",
    fluency: "Fluency",
    confidence: "Confidence",
    ielts: "IELTS",
  };

  return labels[goal] || "Set your learning goal";
}

function formatDateInputValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function getPersonalCompletion(user) {
  const required = [
    Boolean(user?.gender?.trim()),
    Boolean(user?.dateOfBirth),
    Boolean(user?.city?.trim()),
    Boolean(user?.state?.trim()),
    Boolean(user?.profession?.trim()),
  ];

  const completed = required.filter(Boolean).length;

  return {
    completed,
    total: required.length,
    complete: completed === required.length,
  };
}

function getCompletionState(user) {
  if (typeof user?.profileCompletionPercentage === "number" && Number.isFinite(user.profileCompletionPercentage)) {
    const percent = Math.max(0, Math.min(100, Math.round(user.profileCompletionPercentage)));
    const completed = percent >= 100 ? 4 : percent >= 75 ? 3 : percent >= 50 ? 2 : percent >= 25 ? 1 : 0;

    return { completed, total: 4, percent };
  }

  const personal = getPersonalCompletion(user);
  const learning = [
    Boolean(user?.englishLevel),
    Boolean(user?.learningGoal),
    Number.isFinite(user?.dailyPracticeGoalMinutes),
    Boolean(user?.preferredLanguage),
  ];
  const skills = [
    Boolean(user?.skillTestCompleted),
    Number.isFinite(user?.skillTestScore) && user.skillTestScore > 0,
    Number.isFinite(user?.speakingScore) && user.speakingScore > 0,
    Number.isFinite(user?.vocabularyScore) && user.vocabularyScore > 0,
    Number.isFinite(user?.confidenceScore) && user.confidenceScore > 0,
  ];
  const courses = [
    Boolean(user?.recommendedCourse),
    Boolean(user?.recommendationGenerated),
    Array.isArray(user?.joinedCourses) && user.joinedCourses.length > 0,
  ];

  const totalChecks = 8 + learning.length + skills.length + courses.length;
  const completedChecks =
    personal.completed +
    learning.filter(Boolean).length +
    skills.filter(Boolean).length +
    courses.filter(Boolean).length;

  return {
    completed: completedChecks,
    total: totalChecks,
    percent: Math.round((completedChecks / totalChecks) * 100),
  };
}

function createPersonalForm(user) {
  return {
    gender: user?.gender || "",
    dateOfBirth: formatDateInputValue(user?.dateOfBirth),
    city: user?.city || "",
    state: user?.state || "",
    profession: user?.profession || "",
  };
}

export default function StudentProfileDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false);
  const [isSavingPersonal, setIsSavingPersonal] = useState(false);
  const [personalError, setPersonalError] = useState("");
  const [personalForm, setPersonalForm] = useState(createPersonalForm(null));

  useEffect(() => {
    let isMounted = true;

    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        const payload = await response.json();
        return payload?.user || null;
      })
      .then((user) => {
        if (!isMounted) return;
        setCurrentUser(user);
        setPersonalForm(createPersonalForm(user));
      })
      .catch(() => {
        if (!isMounted) return;
        setCurrentUser(null);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const profileState = useMemo(() => getCompletionState(currentUser), [currentUser]);
  const personalState = useMemo(() => getPersonalCompletion(currentUser), [currentUser]);

  const displayName = currentUser?.name || "Dhiraj";
  const displayEmail = currentUser?.email || "dhiraj@example.com";
  const displayPhone = currentUser?.phone || "Add your phone number";
  const displayLocation = [currentUser?.city, currentUser?.state].filter(Boolean).join(", ") || "Add your city";
  const displayGoal = formatLearningGoal(currentUser?.learningGoal);
  const initial = (displayName || displayEmail || "S").trim().charAt(0).toUpperCase();
  const isSkillTestCompleted = Boolean(currentUser?.skillTestCompleted);

  const openPersonalModal = () => {
    setPersonalForm(createPersonalForm(currentUser));
    setPersonalError("");
    setIsPersonalModalOpen(true);
  };

  const closePersonalModal = () => {
    if (isSavingPersonal) return;
    setIsPersonalModalOpen(false);
    setPersonalError("");
  };

  const handlePersonalSave = async (event) => {
    event.preventDefault();
    setIsSavingPersonal(true);
    setPersonalError("");

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(personalForm),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Unable to save your profile.");
      }

      setCurrentUser(payload.user || null);
      setPersonalForm(createPersonalForm(payload.user));
      setIsPersonalModalOpen(false);
    } catch (error) {
      setPersonalError(error.message || "Unable to save your profile.");
    } finally {
      setIsSavingPersonal(false);
    }
  };

  const personalButtonLabel = personalState.complete ? "Completed" : "Complete Now";
  const personalButtonClass = personalState.complete
    ? "englishtaStudentProfile__stepButton englishtaStudentProfile__stepButton--green"
    : "englishtaStudentProfile__stepButton englishtaStudentProfile__stepButton--amber";

  return (
    <div className="container">
      <div className="englishtaStudentProfile">
        <aside className="englishtaStudentProfile__sidebar">
          <div className="englishtaStudentProfile__userCard">
            <div className="englishtaStudentProfile__avatar">
              {currentUser?.avatarUrl ? <img src={currentUser.avatarUrl} alt={displayName} /> : <span>{initial}</span>}
            </div>
            <h2>{displayName}</h2>
            <p>{displayEmail}</p>
          </div>

          <nav className="englishtaStudentProfile__nav" aria-label="Student profile navigation">
            {sidebarLinks.map((item) => (
              <Link
                key={item.href}
                className={`englishtaStudentProfile__navItem${item.active ? " is-active" : ""}`}
                href={item.href}
              >
                <i className={item.icon} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            ))}
            <button
              className="englishtaStudentProfile__navItem englishtaStudentProfile__navItem--button"
              type="button"
              onClick={() => {
                fetch("/api/auth/logout", { method: "POST" }).finally(() => {
                  window.location.href = "/";
                });
              }}
            >
              <i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true" />
              <span>Logout</span>
            </button>
          </nav>

          <div className="englishtaStudentProfile__promoCard">
            <div className="englishtaStudentProfile__promoIcon">
              <i className="fa-solid fa-crown" aria-hidden="true" />
            </div>
            <strong>Go Premium</strong>
            <p>Unlock all courses, practice tests and personalized feedback.</p>
            <Link href="/courses" className="englishtaStudentProfile__promoButton">
              Upgrade Now
            </Link>
          </div>

          <div className="englishtaStudentProfile__helpCard">
            <div className="englishtaStudentProfile__helpIcon">
              <i className="fa-solid fa-headset" aria-hidden="true" />
            </div>
            <strong>Need Help?</strong>
            <p>We are here to help you on your learning journey.</p>
            <Link href="/contact-us">
              Contact Support <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </div>
        </aside>

        <section className="englishtaStudentProfile__main">
          <div className="englishtaStudentProfile__hero">
            <div className="englishtaStudentProfile__heroContent">
              <p className="englishtaStudentProfile__eyebrow">Student Profile</p>
              <h1>
                Welcome back, <span>{displayName}!</span>
              </h1>
              <p className="englishtaStudentProfile__heroText">
                Complete your profile to get personalized learning recommendations and track your progress better.
              </p>

              <div className="englishtaStudentProfile__progressRow">
                <div>
                  <strong>Profile Completion</strong>
                  <span>{profileState.percent}%</span>
                </div>
                <p>
                  {profileState.completed} of {profileState.total} steps completed
                </p>
              </div>

              <div className="englishtaStudentProfile__progressBar" aria-hidden="true">
                <span style={{ width: `${profileState.percent}%` }} />
              </div>

              <div className="englishtaStudentProfile__meta">
                <div>
                  <i className="fa-regular fa-envelope" aria-hidden="true" />
                  <span>{displayEmail}</span>
                </div>
                <div>
                  <i className="fa-regular fa-phone" aria-hidden="true" />
                  <span>{displayPhone}</span>
                </div>
                <div>
                  <i className="fa-solid fa-location-dot" aria-hidden="true" />
                  <span>{displayLocation}</span>
                </div>
                <div>
                  <i className="fa-solid fa-bullseye" aria-hidden="true" />
                  <span>{displayGoal}</span>
                </div>
              </div>
            </div>

            <div className="englishtaStudentProfile__heroArt">
              <div className="englishtaStudentProfile__heroHalo" aria-hidden="true" />
              <img src="/assets/images/aboutenglishta.png" alt="Learning illustration" />
            </div>
          </div>

          <div className="englishtaStudentProfile__sectionHead">
            <div>
              <h2>Complete Your Learning Profile</h2>
              <p>Finish these 3 simple steps to unlock your personalized learning journey.</p>
            </div>

            <div className="englishtaStudentProfile__whyCard">
              <i className="fa-solid fa-crown" aria-hidden="true" />
              <div>
                <strong>Why complete profile?</strong>
                <span>Get better results and course recommendations.</span>
              </div>
              <i className="fa-solid fa-chevron-right" aria-hidden="true" />
            </div>
          </div>

          <div className="englishtaStudentProfile__steps">
            {learningSteps.map((step) => {
              if (step.id === "personal") {
                return (
                  <article
                    className={`englishtaStudentProfile__step englishtaStudentProfile__step--${step.accent}`}
                    key={step.id}
                  >
                    <div className="englishtaStudentProfile__stepTop">
                      <span className={`englishtaStudentProfile__stepBadge englishtaStudentProfile__stepBadge--${step.accent}`}>
                        {step.badge}
                      </span>
                      <span className={`englishtaStudentProfile__stepStatus englishtaStudentProfile__stepStatus--${personalState.complete ? "complete" : "pending"}`}>
                        {personalState.complete ? "Completed" : "Pending"}
                      </span>
                    </div>

                    <div className="englishtaStudentProfile__stepArt" aria-hidden="true">
                      <i className="fa-regular fa-id-card" />
                    </div>

                    <h3>{step.title}</h3>
                    <p>{step.description}</p>

                    <ul>
                      {step.bullets.map((bullet) => (
                        <li key={bullet}>
                          <i className="fa-regular fa-circle-check" aria-hidden="true" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      className={personalButtonClass}
                      type="button"
                      onClick={personalState.complete ? undefined : openPersonalModal}
                      disabled={personalState.complete}
                    >
                      {personalButtonLabel} {personalState.complete ? <i className="fa-solid fa-check" aria-hidden="true" /> : <i className="fa-solid fa-arrow-right" aria-hidden="true" />}
                    </button>
                  </article>
                );
              }

              return (
                <article
                  className={`englishtaStudentProfile__step englishtaStudentProfile__step--${step.accent}`}
                  key={step.id}
                >
                  <div className="englishtaStudentProfile__stepTop">
                    <span className={`englishtaStudentProfile__stepBadge englishtaStudentProfile__stepBadge--${step.accent}`}>
                      {step.badge}
                    </span>
                    <span className={`englishtaStudentProfile__stepStatus englishtaStudentProfile__stepStatus--${step.accent}`}>
                      {step.id === "skills" ? "In Progress" : "Pending"}
                    </span>
                  </div>

                  <div className="englishtaStudentProfile__stepArt" aria-hidden="true">
                    <i
                      className={
                        step.id === "skills"
                          ? "fa-solid fa-bullseye"
                          : "fa-solid fa-graduation-cap"
                      }
                    />
                  </div>

                  <h3>{step.title}</h3>
                  <p>{step.description}</p>

                  <ul>
                    {step.bullets.map((bullet) => (
                      <li key={bullet}>
                        <i className="fa-regular fa-circle-check" aria-hidden="true" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {step.id === "skills" ? (
                    <Link
                      href={step.ctaHref}
                      className={`englishtaStudentProfile__stepButton englishtaStudentProfile__stepButton--${step.accent}`}
                    >
                      {step.cta} <i className={step.ctaIcon} aria-hidden="true" />
                    </Link>
                  ) : isSkillTestCompleted ? (
                    <Link
                      href={step.ctaHref}
                      className={`englishtaStudentProfile__stepButton englishtaStudentProfile__stepButton--${step.accent}`}
                    >
                      Get Suitable Course <i className={step.ctaIcon} aria-hidden="true" />
                    </Link>
                  ) : (
                    <button
                      className={`englishtaStudentProfile__stepButton englishtaStudentProfile__stepButton--${step.accent}`}
                      type="button"
                      disabled
                    >
                      Get Suitable Course <i className={step.ctaIcon} aria-hidden="true" />
                    </button>
                  )}
                </article>
              );
            })}
          </div>

          <div className="englishtaStudentProfile__banner">
            <div className="englishtaStudentProfile__bannerGift" aria-hidden="true">
              <i className="fa-solid fa-gift" />
            </div>
            <div className="englishtaStudentProfile__bannerContent">
              <h3>Complete all 3 steps to unlock</h3>
              <div className="englishtaStudentProfile__bannerFeatures">
                {quickHighlights.map((item) => (
                  <div key={item.label}>
                    <i className={item.icon} aria-hidden="true" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="englishtaStudentProfile__tip">
            <div className="englishtaStudentProfile__tipIcon" aria-hidden="true">
              <i className="fa-regular fa-lightbulb" />
            </div>
            <p>
              <strong>Tip:</strong> Completing your profile helps us personalize your learning experience and show you the right content at the right time.
            </p>
            <button type="button" aria-label="Dismiss tip">
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          </div>
        </section>
      </div>

      {isLoading ? (
        <div className="englishtaStudentProfile__loading" aria-live="polite">
          Loading profile...
        </div>
      ) : null}

      {isPersonalModalOpen ? (
        <div className="englishtaStudentProfile__modal" role="presentation" onMouseDown={closePersonalModal}>
          <section
            aria-labelledby="englishta-personal-profile-title"
            aria-modal="true"
            className="englishtaStudentProfile__modalCard"
            role="dialog"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="englishtaStudentProfile__modalClose" type="button" onClick={closePersonalModal}>
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>

            <p className="englishtaStudentProfile__modalEyebrow">Personal Details</p>
            <h3 id="englishta-personal-profile-title">Complete your profile</h3>
            <p className="englishtaStudentProfile__modalText">
              Fill in the remaining details so we can personalize your recommendations.
            </p>

            <form className="englishtaStudentProfile__modalForm" onSubmit={handlePersonalSave}>
              <label>
                <span>Gender</span>
                <select
                  value={personalForm.gender}
                  onChange={(event) => setPersonalForm((current) => ({ ...current, gender: event.target.value }))}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label>
                <span>Date of Birth</span>
                <input
                  type="date"
                  value={personalForm.dateOfBirth}
                  onChange={(event) => setPersonalForm((current) => ({ ...current, dateOfBirth: event.target.value }))}
                />
              </label>

              <label>
                <span>City</span>
                <input
                  type="text"
                  placeholder="Enter your city"
                  value={personalForm.city}
                  onChange={(event) => setPersonalForm((current) => ({ ...current, city: event.target.value }))}
                />
              </label>

              <label>
                <span>State</span>
                <input
                  type="text"
                  placeholder="Enter your state"
                  value={personalForm.state}
                  onChange={(event) => setPersonalForm((current) => ({ ...current, state: event.target.value }))}
                />
              </label>

              <label className="englishtaStudentProfile__modalFormFull">
                <span>Profession</span>
                <input
                  type="text"
                  placeholder="Enter your profession"
                  value={personalForm.profession}
                  onChange={(event) => setPersonalForm((current) => ({ ...current, profession: event.target.value }))}
                />
              </label>

              {personalError ? <p className="englishtaStudentProfile__modalError">{personalError}</p> : null}

              <button className="englishtaStudentProfile__modalSubmit" type="submit" disabled={isSavingPersonal}>
                {isSavingPersonal ? "Saving..." : "Save Details"}
              </button>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  );
}
