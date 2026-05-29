"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const fallbackProgress = {
  overallProgress: 68,
  currentStreak: 12,
  totalTestsCompleted: 24,
  averageScore: 78,
  totalPracticeMinutes: 900,
  englishLevel: "intermediate",
  skillProgress: {
    speakingConfidence: 78,
    vocabulary: 65,
    grammar: 82,
    communication: 70,
  },
  weeklyChallenge: {
    goalTitle: "Complete 3 Tests",
    targetCount: 3,
    completedCount: 2,
    rewardTitle: "Consistency Badge",
    weekLabel: "This Week",
  },
  dailySpeakingTask: {
    title: "Describe your daily routine in English.",
    estimatedMinutes: 5,
    last7Days: [true, true, true, false, true, true, true],
  },
  scoreHistory: [
    { label: "Week 1", score: 45 },
    { label: "Week 2", score: 58 },
    { label: "Week 3", score: 67 },
    { label: "Week 4", score: 78 },
  ],
  recentTestHistory: [
    { date: "2024-05-24", testName: "Vocabulary Test", type: "Vocabulary", score: 8, totalScore: 10, result: "Good" },
    { date: "2024-05-22", testName: "Speaking Test", type: "Speaking", score: 7, totalScore: 10, result: "Improving" },
    { date: "2024-05-20", testName: "Grammar Test", type: "Grammar", score: 9, totalScore: 10, result: "Excellent" },
    { date: "2024-05-18", testName: "Comprehension Test", type: "Reading", score: 6, totalScore: 10, result: "Average" },
  ],
};

function titleCase(value = "") {
  return String(value || "beginner")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function clampPercent(value, fallback = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function getResultClass(result = "") {
  return `englishtaProgressResult englishtaProgressResult--${String(result).toLowerCase()}`;
}

export default function MyProgressPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        const payload = await response.json();
        return payload?.user || null;
      })
      .then((payloadUser) => {
        if (!mounted) return;
        setUser(payloadUser);
      })
      .catch(() => {
        if (!mounted) return;
        setUser(null);
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const progress = useMemo(() => {
    const skillProgress = {
      ...fallbackProgress.skillProgress,
      ...(user?.skillProgress || {}),
    };
    const weeklyChallenge = {
      ...fallbackProgress.weeklyChallenge,
      ...(user?.weeklyChallenge || {}),
    };
    const dailySpeakingTask = {
      ...fallbackProgress.dailySpeakingTask,
      ...(user?.dailySpeakingTask || {}),
    };
    const scoreHistory = user?.scoreHistory?.length ? user.scoreHistory : fallbackProgress.scoreHistory;
    const recentTestHistory = user?.recentTestHistory?.length ? user.recentTestHistory : fallbackProgress.recentTestHistory;
    const totalPracticeMinutes = user?.totalPracticeMinutes || fallbackProgress.totalPracticeMinutes;
    const averageScore = user?.averageScore || (user?.skillTestScore ? 78 : fallbackProgress.averageScore);
    const overallProgress = user?.overallProgress || user?.profileCompletionPercentage || fallbackProgress.overallProgress;

    return {
      overallProgress: clampPercent(overallProgress, fallbackProgress.overallProgress),
      currentStreak: user?.currentStreak || fallbackProgress.currentStreak,
      totalTestsCompleted: user?.totalTestsCompleted || fallbackProgress.totalTestsCompleted,
      averageScore: clampPercent(averageScore, fallbackProgress.averageScore),
      totalPracticeMinutes,
      speakingPracticeHours: Math.max(1, Math.round(totalPracticeMinutes / 60)),
      englishLevel: user?.englishLevel || fallbackProgress.englishLevel,
      skillProgress,
      weeklyChallenge,
      dailySpeakingTask,
      scoreHistory,
      recentTestHistory,
    };
  }, [user]);

  const challengePercent = clampPercent((progress.weeklyChallenge.completedCount / progress.weeklyChallenge.targetCount) * 100, 0);
  const circleStyle = {
    background: `conic-gradient(#7c3aed ${progress.overallProgress * 3.6}deg, #fbbf24 0deg)`,
  };
  const hasJoinedCourse = Array.isArray(user?.joinedCourses) && user.joinedCourses.length > 0;

  return (
    <>
      <Navbar />
      <main className="englishtaProgressPage">
        <div className="container">
          <section className="englishtaProgressHero">
            <div>
              <h1>My Progress</h1>
              <p>Track your learning journey and improve every day.</p>
            </div>
            <img src="/assets/images/tukoprofile.png" alt="Tuko learning assistant" />
          </section>

          {isLoading ? <div className="englishtaProgressLoading">Loading your progress...</div> : null}

          {!isLoading && !hasJoinedCourse ? (
            <section className="englishtaProgressLocked">
              <span className="englishtaProgressLocked__mainIcon">
                <i className="fa-solid fa-lock" />
              </span>
              <h2>Join a Course to Unlock Your Progress</h2>
              <p>Your progress will be shown here once you enroll in a course.</p>
              <div className="englishtaProgressLocked__features">
                <div>
                  <i className="fa-solid fa-chart-line" />
                  <span>Track your learning progress in real-time</span>
                </div>
                <div>
                  <i className="fa-solid fa-bullseye" />
                  <span>Take tests and see your improvement</span>
                </div>
                <div>
                  <i className="fa-solid fa-microphone" />
                  <span>Practice speaking daily and build fluency</span>
                </div>
                <div>
                  <i className="fa-solid fa-trophy" />
                  <span>Earn achievements and stay motivated</span>
                </div>
              </div>
              <a href="/courses">
                Explore Courses Now <i className="fa-solid fa-arrow-right" />
              </a>
            </section>
          ) : null}

          {!isLoading && hasJoinedCourse ? (
            <>
          <section className="englishtaProgressTopGrid">
            <article className="englishtaProgressOverview">
              <div className="englishtaProgressCircle" style={circleStyle}>
                <div>
                  <strong>{progress.overallProgress}%</strong>
                  <span>Overall Progress</span>
                </div>
              </div>
              <div className="englishtaProgressOverview__meta">
                <span>Current Level</span>
                <strong>{titleCase(progress.englishLevel)}</strong>
                <p>
                  Learning Streak <em>{progress.currentStreak} Days</em>
                </p>
                <small>Keep going! You&apos;re doing great.</small>
                <div className="englishtaProgressMiniBar">
                  <span style={{ width: `${progress.overallProgress}%` }} />
                </div>
              </div>
            </article>

            <article className="englishtaProgressStreak">
              <span><i className="fa-solid fa-fire" /></span>
              <h2>{progress.currentStreak} Day Streak</h2>
              <p>Practice today to keep your streak alive!</p>
              <a href="/skill-assessment">Practice Now <i className="fa-solid fa-arrow-right" /></a>
            </article>
          </section>

          <section className="englishtaProgressStats">
            <article>
              <i className="fa-solid fa-clipboard-check" />
              <span>Tests Completed</span>
              <strong>{progress.totalTestsCompleted}</strong>
              <small>+4 this week</small>
            </article>
            <article>
              <i className="fa-solid fa-chart-simple" />
              <span>Average Score</span>
              <strong>{progress.averageScore}%</strong>
              <small>+8% improvement</small>
            </article>
            <article>
              <i className="fa-solid fa-microphone" />
              <span>Speaking Practice</span>
              <strong>{progress.speakingPracticeHours} Hours</strong>
              <small>+3 hrs this week</small>
            </article>
            <article>
              <i className="fa-solid fa-trophy" />
              <span>Current Level</span>
              <strong>{titleCase(progress.englishLevel)}</strong>
              <small>Keep improving!</small>
            </article>
          </section>

          <section className="englishtaProgressGrid">
            <article className="englishtaProgressCard">
              <header>
                <h2>Skills Improvement</h2>
                <a href="/skill-assessment">View Details <i className="fa-solid fa-arrow-right" /></a>
              </header>
              {[
                ["Speaking Confidence", progress.skillProgress.speakingConfidence, "fa-solid fa-microphone", "purple"],
                ["Vocabulary", progress.skillProgress.vocabulary, "fa-solid fa-book-open", "blue"],
                ["Grammar", progress.skillProgress.grammar, "fa-solid fa-spell-check", "green"],
                ["Communication", progress.skillProgress.communication, "fa-solid fa-comments", "orange"],
              ].map(([label, value, icon, color]) => (
                <div className="englishtaSkillProgress" key={label}>
                  <i className={`${icon} englishtaSkillProgress__icon--${color}`} />
                  <span>{label}</span>
                  <div><em style={{ width: `${clampPercent(value)}%` }} /></div>
                  <strong>{clampPercent(value)}%</strong>
                </div>
              ))}
            </article>

            <article className="englishtaProgressCard">
              <header>
                <h2>Daily Speaking Practice</h2>
                <span className="englishtaProgressPill">Today&apos;s Task</span>
              </header>
              <div className="englishtaDailyTask">
                <i className="fa-solid fa-microphone" />
                <div>
                  <strong>{progress.dailySpeakingTask.title}</strong>
                  <span>Estimated Time</span>
                  <p>{progress.dailySpeakingTask.estimatedMinutes} Minutes</p>
                </div>
                <a href="/skill-assessment">Start Practice <i className="fa-solid fa-arrow-right" /></a>
              </div>
              <h3>Last 7 Days</h3>
              <div className="englishtaProgressDays">
                {dayLabels.map((day, index) => (
                  <span className={progress.dailySpeakingTask.last7Days?.[index] ? "isDone" : "isMissed"} key={day}>
                    <small>{day}</small>
                    <i className={progress.dailySpeakingTask.last7Days?.[index] ? "fa-solid fa-check" : "fa-solid fa-xmark"} />
                  </span>
                ))}
              </div>
            </article>

            <article className="englishtaProgressCard englishtaWeeklyChallenge">
              <header>
                <h2>Weekly Challenge</h2>
                <span className="englishtaProgressPill englishtaProgressPill--warm">{progress.weeklyChallenge.weekLabel}</span>
              </header>
              <p>Goal: {progress.weeklyChallenge.goalTitle}</p>
              <strong>
                {progress.weeklyChallenge.completedCount} <span>/ {progress.weeklyChallenge.targetCount} Completed</span>
              </strong>
              <div className="englishtaProgressMiniBar">
                <span style={{ width: `${challengePercent}%` }} />
              </div>
              <small>Reward: 🏅 {progress.weeklyChallenge.rewardTitle}</small>
            </article>

            <article className="englishtaProgressCard">
              <header>
                <h2>Score Improvement Over Time</h2>
                <span className="englishtaProgressTextButton">30 Days</span>
              </header>
              <div className="englishtaScoreChart">
                {progress.scoreHistory.map((item) => (
                  <span style={{ height: `${clampPercent(item.score)}%` }} key={`${item.label}-${item.score}`}>
                    <em>{clampPercent(item.score)}%</em>
                    <small>{item.label}</small>
                  </span>
                ))}
              </div>
            </article>
          </section>

          <section className="englishtaProgressCard englishtaProgressHistory">
            <header>
              <h2>Recent Test History</h2>
              <a href="/skill-assessment">View All Tests <i className="fa-solid fa-arrow-right" /></a>
            </header>
            <div className="englishtaProgressTableWrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Test Name</th>
                    <th>Type</th>
                    <th>Score</th>
                    <th>Result</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {progress.recentTestHistory.map((test, index) => (
                    <tr key={`${test.testName}-${index}`}>
                      <td>{formatDate(test.date)}</td>
                      <td>{test.testName}</td>
                      <td>{test.type}</td>
                      <td>{test.score}/{test.totalScore} ({clampPercent((test.score / test.totalScore) * 100)}%)</td>
                      <td><span className={getResultClass(test.result)}>{test.result}</span></td>
                      <td><a href="/skill-assessment">View Details <i className="fa-solid fa-arrow-right" /></a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
            </>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
