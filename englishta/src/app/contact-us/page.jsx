"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ContactUs = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "male",
    occupation: "student",
    standard: "",
    city: "",
    state: "",
    interest: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback({ type: "", message: "" });

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.mobile.trim() ||
      !form.interest.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      (form.occupation === "student" && !form.standard.trim())
    ) {
      setFeedback({ type: "error", message: "Please fill all required fields." });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/course-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          mobile: form.mobile,
          email: form.email,
          gender: form.gender,
          occupation: form.occupation,
          standard: form.occupation === "student" ? form.standard : "",
          city: form.city,
          state: form.state,
          courseName: form.interest,
          message: form.message,
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to submit inquiry.");
      }

      setFeedback({ type: "success", message: "Inquiry submitted successfully." });
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        gender: "male",
        occupation: "student",
        standard: "",
        city: "",
        state: "",
        interest: "",
        message: "",
      });
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Failed to submit inquiry." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="englishta-contact-page">
        <section className="englishta-contact-hero">
          <div className="container wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.15s">
            <p className="td_section_subtitle_up td_fs_18 td_semibold td_spacing_1 td_mb_10 text-uppercase td_accent_color">
              Contact Englishta
            </p>
            <h1>Start Your English Speaking Journey Online</h1>
            <p>
              Connect with our Nashik-based English trainer for online spoken
              English classes, interview preparation, pronunciation practice,
              and confidence-building sessions.
            </p>
          </div>
        </section>

        <section className="englishta-contact-section">
          <div className="container">
            <div className="englishta-contact-grid">
              <div className="englishta-contact-info wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.15s">
                <div className="englishta-contact-card">
                  <i className="fa-solid fa-phone" />
                  <div>
                    <h2>Call or WhatsApp</h2>
                    <a href="tel:+919876543210">+91 98765 43210</a>
                  </div>
                </div>
                <div className="englishta-contact-card">
                  <i className="fa-solid fa-envelope" />
                  <div>
                    <h2>Email Us</h2>
                    <a href="mailto:hello@englishta.com">hello@englishta.com</a>
                  </div>
                </div>
                <div className="englishta-contact-card">
                  <i className="fa-solid fa-location-dot" />
                  <div>
                    <h2>Based In</h2>
                    <p>Nashik, Maharashtra. Online classes available.</p>
                  </div>
                </div>
                <div className="englishta-contact-note">
                  <h3>Looking for a free demo?</h3>
                  <p>
                    Share your current level and goal. We will suggest the right
                    online batch for spoken English, interview English, or daily
                    conversation practice.
                  </p>
                </div>
              </div>

              <form
                className="englishta-contact-form wow fadeInRight"
                data-wow-duration="1s"
                data-wow-delay="0.25s"
                onSubmit={handleSubmit}
              >
                <div className="englishta-form-row">
                  <label>
                    First Name
                    <input
                      type="text"
                      placeholder="First name"
                      value={form.firstName}
                      onChange={(event) => updateField("firstName", event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Last Name
                    <input
                      type="text"
                      placeholder="Last name"
                      value={form.lastName}
                      onChange={(event) => updateField("lastName", event.target.value)}
                      required
                    />
                  </label>
                </div>
                <div className="englishta-form-row">
                  <label>
                    Email Address
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Mobile Number
                    <input
                      type="tel"
                      placeholder="Your mobile number"
                      value={form.mobile}
                      onChange={(event) => updateField("mobile", event.target.value)}
                      required
                    />
                  </label>
                </div>
                <label>
                  Gender
                  <div className="englishtaWebinarModal__choices">
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={form.gender === "male"}
                        onChange={(event) => updateField("gender", event.target.value)}
                      />
                      <span>Male</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={form.gender === "female"}
                        onChange={(event) => updateField("gender", event.target.value)}
                      />
                      <span>Female</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="other"
                        checked={form.gender === "other"}
                        onChange={(event) => updateField("gender", event.target.value)}
                      />
                      <span>Other</span>
                    </label>
                  </div>
                </label>
                <div className="englishta-form-row">
                  <label>
                    Occupation
                    <select
                      value={form.occupation}
                      onChange={(event) => updateField("occupation", event.target.value)}
                      required
                    >
                      <option value="student">Student</option>
                      <option value="employed">Employed</option>
                    </select>
                  </label>
                  {form.occupation === "student" ? (
                    <label>
                      Standard
                      <select
                        value={form.standard}
                        onChange={(event) => updateField("standard", event.target.value)}
                        required
                      >
                        <option value="">Select standard</option>
                        <option>4th Standard</option>
                        <option>5th Standard</option>
                        <option>6th Standard</option>
                        <option>7th Standard</option>
                        <option>8th Standard</option>
                        <option>9th Standard</option>
                        <option>10th Standard</option>
                        <option>11th Standard</option>
                        <option>12th Standard</option>
                        <option>Diploma</option>
                        <option>Bachelor&apos;s</option>
                        <option>Master&apos;s</option>
                      </select>
                    </label>
                  ) : <div />}
                </div>
                <label>
                  Course Interest
                  <select
                    name="interest"
                    value={form.interest}
                    onChange={(event) => updateField("interest", event.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select a course
                    </option>
                    <option>Spoken English</option>
                    <option>Interview English</option>
                    <option>Pronunciation Practice</option>
                    <option>Corporate Communication</option>
                    <option>Public Speaking</option>
                  </select>
                </label>
                <div className="englishta-form-row">
                  <label>
                    City
                    <input
                      type="text"
                      placeholder="Your city"
                      value={form.city}
                      onChange={(event) => updateField("city", event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    State
                    <input
                      type="text"
                      placeholder="Your state"
                      value={form.state}
                      onChange={(event) => updateField("state", event.target.value)}
                      required
                    />
                  </label>
                </div>
                <label>
                  Message
                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Tell us what you want to improve"
                    value={form.message}
                    onChange={(event) => updateField("message", event.target.value)}
                  />
                </label>
                {feedback.message ? (
                  <p className={feedback.type === "success" ? "englishta-contact-feedback success" : "englishta-contact-feedback error"}>
                    {feedback.message}
                  </p>
                ) : null}
                <button type="submit" className="td_btn td_style_1 td_radius_10 td_medium">
                  <span className="td_btn_in td_white_color td_accent_bg">
                    <span>{submitting ? "Sending..." : "Send Inquiry"}</span>
                  </span>
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ContactUs;
