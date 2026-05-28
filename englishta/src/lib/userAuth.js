import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const USER_AUTH_COOKIE = "englishta_user_token";
const USER_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export function getJwtSecret() {
  const secret = process.env.USER_JWT_SECRET || process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("Missing USER_JWT_SECRET environment variable.");
  }

  return secret;
}

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

export function sanitizeUser(user) {
  if (!user) return null;

  return {
    id: String(user._id),
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    avatarUrl: user.avatarUrl || "",
    authProvider: user.authProvider || "credentials",
    profileCompletionPercentage: user.profileCompletionPercentage ?? 0,
    onboardingCompleted: Boolean(user.onboardingCompleted),
    gender: user.gender || "",
    dateOfBirth: user.dateOfBirth || null,
    city: user.city || "",
    state: user.state || "",
    profession: user.profession || "",
    englishLevel: user.englishLevel || "",
    learningGoal: user.learningGoal || "",
    dailyPracticeGoalMinutes: user.dailyPracticeGoalMinutes ?? 15,
    preferredLanguage: user.preferredLanguage || "english",
    skillTestCompleted: Boolean(user.skillTestCompleted),
    skillTestScore: user.skillTestScore ?? 0,
    speakingScore: user.speakingScore ?? 0,
    vocabularyScore: user.vocabularyScore ?? 0,
    confidenceScore: user.confidenceScore ?? 0,
    recommendationGenerated: Boolean(user.recommendationGenerated),
    currentStreak: user.currentStreak ?? 0,
    totalPracticeMinutes: user.totalPracticeMinutes ?? 0,
    totalTestsCompleted: user.totalTestsCompleted ?? 0,
    joinedCourses: Array.isArray(user.joinedCourses) ? user.joinedCourses : [],
  };
}

export function createUserToken(user) {
  return jwt.sign(
    {
      sub: String(user._id),
      email: user.email,
      provider: user.authProvider,
    },
    getJwtSecret(),
    {
      expiresIn: USER_TOKEN_MAX_AGE,
    },
  );
}

export function setUserAuthCookie(response, token) {
  response.cookies.set(USER_AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: USER_TOKEN_MAX_AGE,
  });
}

export function clearUserAuthCookie(response) {
  response.cookies.set(USER_AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getUserTokenPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_AUTH_COOKIE)?.value;

  if (!token) return null;

  try {
    return jwt.verify(token, getJwtSecret());
  } catch {
    return null;
  }
}
