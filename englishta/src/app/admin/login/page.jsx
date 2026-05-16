"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import "../admin.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!form.password.trim()) {
      setError("Password is required.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Login failed.");
      }

      router.push("/admin");
      router.refresh();
    } catch (loginError) {
      setError(loginError.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="adminLoginShell">
      <div className="adminLoginCard">
        <div className="adminLoginCard__head">
          <p>Englishta Admin</p>
          <h1>Sign In</h1>
          <span>Use the admin email and password from your `.env.local` file.</span>
        </div>

        <form className="adminLoginForm" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              required
            />
          </label>

          {error ? <div className="adminLoginError">{error}</div> : null}

          <button type="submit" className="adminButton adminButtonAlt" disabled={submitting}>
            {submitting ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
