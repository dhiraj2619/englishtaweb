"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function SkillAssessmentPage() {
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [warningCount, setWarningCount] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    let mounted = true;

    fetch("/api/skill-check-tests/active", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "Unable to load skill test.");
        }
        return payload.data;
      })
      .then((data) => {
        if (!mounted) return;
        setTest(data);
        setRemainingSeconds(Number(data.timeLimitMinutes || 15) * 60);
      })
      .catch((loadError) => {
        if (!mounted) return;
        setError(loadError.message || "Unable to load skill test.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!started || result) return undefined;

    const blockDefault = (event) => event.preventDefault();
    const trackVisibility = () => {
      if (document.hidden) {
        setWarningCount((current) => current + 1);
      }
    };
    const trackFullscreenExit = () => {
      if (!document.fullscreenElement) {
        setWarningCount((current) => current + 1);
      }
    };
    const warnBeforeLeave = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    document.addEventListener("copy", blockDefault);
    document.addEventListener("cut", blockDefault);
    document.addEventListener("paste", blockDefault);
    document.addEventListener("contextmenu", blockDefault);
    document.addEventListener("visibilitychange", trackVisibility);
    document.addEventListener("fullscreenchange", trackFullscreenExit);
    window.addEventListener("beforeunload", warnBeforeLeave);

    return () => {
      document.removeEventListener("copy", blockDefault);
      document.removeEventListener("cut", blockDefault);
      document.removeEventListener("paste", blockDefault);
      document.removeEventListener("contextmenu", blockDefault);
      document.removeEventListener("visibilitychange", trackVisibility);
      document.removeEventListener("fullscreenchange", trackFullscreenExit);
      window.removeEventListener("beforeunload", warnBeforeLeave);
    };
  }, [result, started]);

  const currentQuestion = test?.questions?.[currentIndex];
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const totalQuestions = test?.questions?.length ?? 0;
  const progressPercent = totalQuestions ? Math.round(((currentIndex + 1) / totalQuestions) * 100) : 0;
  const selectedAnswer = currentQuestion ? answers[currentQuestion._id] : undefined;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const seconds = String(remainingSeconds % 60).padStart(2, "0");

  async function startAssessment() {
    setStarted(true);

    try {
      await document.documentElement.requestFullscreen?.();
    } catch {
      setWarningCount((current) => current + 1);
    }
  }

  function chooseAnswer(optionIndex) {
    if (!currentQuestion) return;

    setAnswers((current) => ({
      ...current,
      [currentQuestion._id]: optionIndex,
    }));
  }

  function goNext() {
    if (selectedAnswer === undefined) return;
    setCurrentIndex((current) => Math.min(current + 1, totalQuestions - 1));
  }

  const submitTest = useCallback(async () => {
    if (!test || submitting || result) return;

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/skill-check-tests/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testId: test._id,
          warningCount,
          answers: test.questions.map((question) => ({
            questionId: question._id,
            selectedOptionIndex: answers[question._id] ?? -1,
          })),
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Unable to submit skill test.");
      }

      setResult(payload.data);
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (submitError) {
      setError(submitError.message || "Unable to submit skill test.");
    } finally {
      setSubmitting(false);
    }
  }, [answers, result, submitting, test, warningCount]);

  useEffect(() => {
    if (!started || result || submitting) return undefined;

    const timerId = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timerId);
          submitTest();
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [result, started, submitting, submitTest]);

  if (loading) {
    return <main className="englishtaSkillTest">Loading assessment...</main>;
  }

  if (error && !test) {
    return (
      <main className="englishtaSkillTest">
        <section className="englishtaSkillTest__empty">
          <h1>Skill assessment unavailable</h1>
          <p>{error}</p>
          <Link href="/student-profile">Back to profile</Link>
        </section>
      </main>
    );
  }

  if (result) {
    return (
      <main className="englishtaSkillTest">
        <section className="englishtaSkillTest__result">
          <p>Assessment Completed</p>
          <h1>Your English level is {result.resultLevel}</h1>
          <div className="englishtaSkillTest__score">
            <strong>
              {result.score}/{result.totalMarks}
            </strong>
            <span>Total Score</span>
          </div>
          <div className="englishtaSkillTest__breakdown">
            <span>Speaking: {result.speakingScore}</span>
            <span>Vocabulary: {result.vocabularyScore}</span>
            <span>Confidence: {result.confidenceScore}</span>
            <span>Grammar: {result.grammarScore}</span>
          </div>
          <Link href="/student-profile" className="englishtaSkillTest__primary">
            Continue
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="englishtaSkillTest">
      {!started ? (
        <section className="englishtaSkillTest__intro">
          <p>Skill Check Test Set {test.setCode}</p>
          <h1>{test.title}</h1>
          <span>{test.description}</span>
          <div className="englishtaSkillTest__rules">
            <div>
              <strong>{totalQuestions}</strong>
              <span>Questions</span>
            </div>
            <div>
              <strong>{test.timeLimitMinutes}</strong>
              <span>Minutes</span>
            </div>
            <div>
              <strong>No Switching</strong>
              <span>Tab changes are recorded</span>
            </div>
          </div>
          <button type="button" className="englishtaSkillTest__primary" onClick={startAssessment}>
            Start Assessment
          </button>
          <Link href="/student-profile" className="englishtaSkillTest__link">
            Back to profile
          </Link>
        </section>
      ) : (
        <section className="englishtaSkillTest__card">
          <header className="englishtaSkillTest__topbar">
            <div>
              <span>Set {test.setCode}</span>
              <strong>{test.title}</strong>
            </div>
            <div className="englishtaSkillTest__timer">{minutes}:{seconds}</div>
          </header>

          <div className="englishtaSkillTest__progress">
            <span style={{ width: `${progressPercent}%` }} />
          </div>

          {warningCount ? (
            <div className="englishtaSkillTest__warning">
              Warning recorded: do not switch tabs or exit fullscreen during the test.
            </div>
          ) : null}

          <div className="englishtaSkillTest__questionMeta">
            <span>
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span>{answeredCount}/{totalQuestions} answered</span>
          </div>

          <h2>{currentQuestion.question}</h2>

          <div className="englishtaSkillTest__options">
            {currentQuestion.options.map((option, optionIndex) => (
              <button
                type="button"
                className={selectedAnswer === optionIndex ? "is-selected" : ""}
                onClick={() => chooseAnswer(optionIndex)}
                key={optionIndex}
              >
                <span>{String.fromCharCode(65 + optionIndex)}</span>
                <strong className="englishtaSkillTest__optionText">{option}</strong>
                <small>({currentQuestion.optionScores?.[optionIndex] ?? optionIndex + 1})</small>
              </button>
            ))}
          </div>

          {error ? <p className="englishtaSkillTest__error">{error}</p> : null}

          <footer className="englishtaSkillTest__footer">
            {isLastQuestion ? (
              <button
                type="button"
                className="englishtaSkillTest__primary"
                disabled={selectedAnswer === undefined || submitting}
                onClick={submitTest}
              >
                {submitting ? "Submitting..." : "Submit Test"}
              </button>
            ) : (
              <button
                type="button"
                className="englishtaSkillTest__primary"
                disabled={selectedAnswer === undefined}
                onClick={goNext}
              >
                Next Question
              </button>
            )}
          </footer>
        </section>
      )}
    </main>
  );
}
