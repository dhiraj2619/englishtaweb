"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const gmailAddress = "hello@englishta.com";

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setFeedback({ type: "", message: "" });

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.message.trim()) {
      setFeedback({ type: "error", message: "Please fill all required fields." });
      return;
    }

    const subject = form.subject.trim() || `Inquiry from ${form.name.trim()}`;
    const body = [
      `Name: ${form.name.trim()}`,
      `Email: ${form.email.trim()}`,
      `Phone: ${form.phone.trim()}`,
      "",
      "Message:",
      form.message.trim(),
    ].join("\n");

    const mailtoUrl = `mailto:${gmailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    setFeedback({ type: "success", message: "Your email app is opening with the inquiry draft." });
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
              Connect with our online English trainer for spoken
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
                    <h2>Class Mode</h2>
                    <p>Live online classes available from anywhere.</p>
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
                    Full Name
                    <input
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Email Address
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Phone Number
                    <input
                      type="tel"
                      placeholder="Your phone number"
                      value={form.phone}
                      onChange={(event) => updateField("phone", event.target.value)}
                      required
                    />
                  </label>
                </div>
                <label>
                  Subject
                  <input
                    type="text"
                    placeholder="Inquiry subject"
                    value={form.subject}
                    onChange={(event) => updateField("subject", event.target.value)}
                  />
                </label>
                <label>
                  Message
                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Tell us how we can help you"
                    value={form.message}
                    onChange={(event) => updateField("message", event.target.value)}
                    required
                  />
                </label>
                {feedback.message ? (
                  <p className={feedback.type === "success" ? "englishta-contact-feedback success" : "englishta-contact-feedback error"}>
                    {feedback.message}
                  </p>
                ) : null}
                <button type="submit" className="td_btn td_style_1 td_radius_10 td_medium">
                  <span className="td_btn_in td_white_color td_accent_bg">
                    <span>Send Inquiry</span>
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
