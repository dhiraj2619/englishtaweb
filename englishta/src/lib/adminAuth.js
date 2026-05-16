import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "englishta_admin_session";

export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || "",
    password: process.env.ADMIN_PASSWORD || "",
    secret: process.env.ADMIN_SESSION_SECRET || "",
  };
}

export function getAdminSessionValue() {
  const { email, password, secret } = getAdminCredentials();
  return `${email}|${password}|${secret}`;
}

export function validateAdminCredentials(email, password) {
  const admin = getAdminCredentials();
  return email === admin.email && password === admin.password && Boolean(admin.secret);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value === getAdminSessionValue();
}

export async function requireAdminAccess() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }
}
