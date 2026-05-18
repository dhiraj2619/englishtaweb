"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tutorImage =
  "/assets/images/raajshlke.png";

const fallbackWebinars = [
  {
    date: "25 May, 2025",
    time: "7:00 PM IST",
    title: "Speak English Confidently in Daily Life",
    text: "Learn simple strategies to speak English fluently and confidently in everyday conversations.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    type: "Live",
    link: "#",
  },
  {
    date: "08 June, 2025",
    time: "7:00 PM IST",
    title: "Ace Your English Interview",
    text: "Master common interview questions and improve your responses with expert tips.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
    type: "Live",
    link: "#",
  },
  {
    date: "22 June, 2025",
    time: "7:00 PM IST",
    title: "Expand Vocabulary The Smart Way",
    text: "Learn techniques to build strong vocabulary and use it naturally in conversations.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80",
    type: "Recorded",
    link: "#",
  },
];

const benefits = [
  ["fa-solid fa-chalkboard-user", "Expert-Led Sessions", "Learn directly from experienced English communication expert."],
  ["fa-regular fa-comments", "Live Interaction & Q&A", "Ask questions and get personalized feedback in real-time."],
  ["fa-regular fa-circle-play", "Practical Learning", "Get useful tips and techniques you can apply immediately."],
  ["fa-solid fa-globe", "Learn From Anywhere", "Join from the comfort of your home, anytime, anywhere."],
  ["fa-solid fa-certificate", "Free & Valuable Sessions", "High-quality learning completely free for everyone."],
];

const testimonials = [
  ["Sneha P.", "Student", "The webinars are super helpful. I gained so much confidence in speaking English after joining."],
  ["Rahul S.", "Working Professional", "Prof. Raj Shelke explains everything so clearly. The live interaction is the best part."],
  ["Anjali K.", "Teacher", "Englishta webinars are practical, engaging, and truly improving my communication skills."],
];

const standardOptions = [
  "4th Standard",
  "5th Standard",
  "6th Standard",
  "7th Standard",
  "8th Standard",
  "9th Standard",
  "10th Standard",
  "11th Standard",
  "12th Standard",
  "Diploma",
  "Bachelor of Arts (BA)",
  "Bachelor of Commerce (BCom)",
  "Bachelor of Science (BSc)",
  "Bachelor of Business Administration (BBA)",
  "Bachelor of Computer Applications (BCA)",
  "Bachelor of Engineering (BE)",
  "Bachelor of Technology (BTech)",
  "Bachelor of Education (BEd)",
  "Bachelor of Pharmacy (BPharm)",
  "Bachelor of Management Studies (BMS)",
  "Master of Arts (MA)",
  "Master of Commerce (MCom)",
  "Master of Science (MSc)",
  "Master of Business Administration (MBA)",
  "Master of Computer Applications (MCA)",
  "Master of Technology (MTech)",
  "Master of Education (MEd)",
  "Master of Pharmacy (MPharm)",
];

const WebinarPage = () => {
  const [webinars, setWebinars] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedWebinarId, setSelectedWebinarId] = useState("");
  const [selectedWebinar, setSelectedWebinar] = useState("");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
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
  });

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % testimonials.length);
    }, 4000);

    return () => window.clearInterval(timerId);
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/webinars", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => {
        if (isMounted && payload.success) {
          setWebinars(payload.data ?? []);
        }
      })
      .catch(() => {
        if (isMounted) {
          setWebinars([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function openRegisterModal(webinarTitle = "Webinar Registration", webinarId = "") {
    setSelectedWebinarId(webinarId);
    setSelectedWebinar(webinarTitle);
    setSubmitError("");
    setIsModalOpen(true);
  }

  function closeRegisterModal() {
    setIsModalOpen(false);
    setSubmitError("");
  }

  function closeSuccessModal() {
    setIsSuccessModalOpen(false);
  }

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleOccupationChange(value) {
    setForm((current) => ({
      ...current,
      occupation: value,
      standard: value === "student" ? current.standard : "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/webinar-registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          webinarId: selectedWebinarId,
          webinarTitle: selectedWebinar,
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to submit webinar registration.");
      }

      closeRegisterModal();
      setIsSuccessModalOpen(true);
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
      });
    } catch (error) {
      setSubmitError(error.message || "Failed to submit webinar registration.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function goToTestimonial(index) {
    setActiveTestimonial(index);
  }

  function formatWebinarDate(dateTimeValue) {
    const date = new Date(dateTimeValue);

    if (Number.isNaN(date.getTime())) {
      return { date: dateTimeValue, time: "" };
    }

    return {
      date: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      time: date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }),
    };
  }

  const webinarItems = webinars.length
    ? webinars.map((item) => {
      const formatted = formatWebinarDate(item.dateTime);

      return {
        ...item,
        date: formatted.date,
        time: formatted.time,
        text: item.description,
        image: item.thumbnail,
      };
    })
    : fallbackWebinars;

  return (
    <>
      <Navbar />
      <main className="englishtaWebinarPage">
        <section className="englishtaWebinarHero">
          <div className="container">
            <div className="englishtaWebinarHero__copy wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.15s">
              <p>Live Webinars</p>
              <h1>
                Learn. Practice. <span>Grow Together.</span>
              </h1>
              <p className="englishtaWebinarHero__text">
                Join our expert-led live webinars and take your English speaking skills to the next level.
              </p>
              <div className="englishtaWebinarHero__points">
                <span><i className="fa-solid fa-people-arrows" />Live Interaction</span>
                <span><i className="fa-regular fa-lightbulb" />Expert Guidance</span>
                <span><i className="fa-solid fa-person-chalkboard" />Practical Learning</span>
              </div>
              <div className="englishtaWebinarHero__actions">
                <button type="button" onClick={() => openRegisterModal("Live Webinar Registration")}>
                  Register for Free
                  <i className="fa-solid fa-arrow-right" />
                </button>
                <a href="#upcoming" className="englishtaWebinarHero__link">
                  See All Webinars
                  <i className="fa-solid fa-arrow-right" />
                </a>
              </div>
            </div>

            <div className="englishtaWebinarHero__visual wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.25s">
              <div className="englishtaWebinarHero__rings" />
              <div className="englishtaWebinarHero__card">
                <span>Live</span>
                <img src={tutorImage} alt="Prof. Raj Shelke" />
                <div>
                  <i className="fa-solid fa-microphone" />
                  <strong>Prof. Raj Shelke</strong>
                  <p>Founder & English Communication Expert</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="englishtaWebinarUpcoming" id="upcoming">
          <div className="container">
            <div className="englishtaWebinarSectionHead wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s">
              <div>
                <p>Upcoming Webinars</p>
                <h2>Join Our Live Sessions</h2>
              </div>
              <a href="/contact-us">
                View All Webinars
                <i className="fa-solid fa-arrow-right" />
              </a>
            </div>

            <div className="englishtaWebinarCards">
              {webinarItems.map((webinar, index) => (
                <article
                  className="englishtaWebinarCard wow fadeInUp"
                  data-wow-duration="1s"
                  data-wow-delay={`${0.15 + index * 0.1}s`}
                  key={webinar._id ?? webinar.title}
                >
                  <div className="englishtaWebinarCard__media">
                    <img src={webinar.image} alt={webinar.title} />
                    <span>{webinar.type || "Live"}</span>
                  </div>
                  <div className="englishtaWebinarCard__content">
                    <div className="englishtaWebinarCard__meta d-flex align-items-center gap-3">
                      <p><i className="fa-regular fa-calendar" />{webinar.date}</p>
                      {webinar.time ? <p><i className="fa-regular fa-clock" />{webinar.time}</p> : null}
                    </div>
                    <h3>{webinar.title}</h3>
                    <p>{webinar.text}</p>
                  </div>
                  <div className="englishtaWebinarCard__footer">
                    {webinar.type === "Recorded" ? (
                      <a href={webinar.link} target="_blank" rel="noreferrer">
                        Watch Recording
                        <i className="fa-solid fa-arrow-right" />
                      </a>
                    ) : (
                      <button type="button" onClick={() => openRegisterModal(webinar.title, webinar._id ?? "")}>
                        Register Now
                        <i className="fa-solid fa-arrow-right" />
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="englishtaWebinarBenefits">
          <div className="container">
            <h2 className="wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s">
              Why Join Our <span>Webinars?</span>
            </h2>
            <div className="englishtaWebinarLine" />
            <div className="englishtaWebinarBenefits__grid">
              {benefits.map(([icon, title, text], index) => (
                <article
                  className="wow fadeInUp"
                  data-wow-duration="1s"
                  data-wow-delay={`${0.12 + index * 0.08}s`}
                  key={title}
                >
                  <i className={icon} />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="englishtaWebinarTestimonials">
          <div className="container">
            <h2 className="wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s">
              What <span>Learners</span> Say
            </h2>
            <div className="englishtaWebinarLine" />
            <div className="englishtaWebinarTestimonials__grid">
              <div
                className="englishtaWebinarTestimonials__track"
                style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
              >
                {testimonials.map(([name, role, text], index) => (
                  <article
                    className="wow fadeInUp"
                    data-wow-duration="1s"
                    data-wow-delay={`${0.15 + index * 0.1}s`}
                    key={name}
                  >
                    <i className="fa-solid fa-quote-left" />
                    <div className="englishtaWebinarStars">
                      <i className="fa-solid fa-star" />
                      <i className="fa-solid fa-star" />
                      <i className="fa-solid fa-star" />
                      <i className="fa-solid fa-star" />
                      <i className="fa-solid fa-star" />
                    </div>
                    <p>{text}</p>
                    <div>
                      <span>{name.charAt(0)}</span>
                      <strong>{name}<small>{role}</small></strong>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="englishtaWebinarDots">
              {testimonials.map((item, index) => (
                <button
                  type="button"
                  key={item[0]}
                  className={activeTestimonial === index ? "active" : ""}
                  onClick={() => goToTestimonial(index)}
                  aria-label={`Show testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="englishtaWebinarCta">
          <div className="container">
            <div className="englishtaWebinarCta__panel wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.15s">
              <img src="/assets/images/aboutenglishta.png" alt="Englishta mascot" />
              <div>
                <h2>Don&apos;t Miss Out!</h2>
                <p>Join our live webinars and start speaking English with confidence.</p>
              </div>
              <button type="button" onClick={() => openRegisterModal("Join Your Next Webinar")}>
                Join Your Next Webinar
                <i className="fa-solid fa-arrow-right" />
              </button>
            </div>
          </div>
        </section>
      </main>
      {isModalOpen ? (
        <div className="englishtaWebinarModal" onClick={closeRegisterModal}>
          <div
            className="englishtaWebinarModal__dialog"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="webinar-register-title"
          >
            <button type="button" className="englishtaWebinarModal__close" onClick={closeRegisterModal}>
              <i className="fa-solid fa-xmark" />
            </button>
            <div className="englishtaWebinarModal__head">
              <p>{selectedWebinar}</p>
              <h2 id="webinar-register-title">Register Now</h2>
            </div>

            <form className="englishtaWebinarModal__form" onSubmit={handleSubmit}>
              <div className="englishtaWebinarModal__grid">
                <label>
                  <span>First Name</span>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(event) => updateField("firstName", event.target.value)}
                    required
                  />
                </label>
                <label>
                  <span>Last Name</span>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(event) => updateField("lastName", event.target.value)}
                    required
                  />
                </label>
                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    required
                  />
                </label>
                <label>
                  <span>Mobile</span>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(event) => updateField("mobile", event.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="englishtaWebinarModal__group">
                <span>Gender</span>
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
              </div>

              <label className="englishtaWebinarModal__full">
                <span>Occupation</span>
                <select value={form.occupation} onChange={(event) => handleOccupationChange(event.target.value)}>
                  <option value="student">Student</option>
                  <option value="employed">Employed</option>
                </select>
              </label>

              {form.occupation === "student" ? (
                <label className="englishtaWebinarModal__full">
                  <span>Standard</span>
                  <select
                    value={form.standard}
                    onChange={(event) => updateField("standard", event.target.value)}
                    required
                  >
                    <option value="">Select standard</option>
                    {standardOptions.map((option) => (
                      <option value={option} key={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              <div className="englishtaWebinarModal__grid">
                <label>
                  <span>City</span>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(event) => updateField("city", event.target.value)}
                    required
                  />
                </label>
                <label>
                  <span>State</span>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(event) => updateField("state", event.target.value)}
                    required
                  />
                </label>
              </div>

              {submitError ? <p className="englishtaWebinarModal__feedback error">{submitError}</p> : null}

              <button type="submit" className="englishtaWebinarModal__submit">
                {isSubmitting ? "Submitting..." : "Submit"}
                <i className="fa-solid fa-arrow-right" />
              </button>
            </form>
          </div>
        </div>
      ) : null}
      {isSuccessModalOpen ? (
        <div className="englishtaWebinarModal" onClick={closeSuccessModal}>
          <div
            className="englishtaWebinarModal__dialog englishtaWebinarModal__dialog--success"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="webinar-success-title"
          >
            <button type="button" className="englishtaWebinarModal__close" onClick={closeSuccessModal}>
              <i className="fa-solid fa-xmark" />
            </button>
            <div className="englishtaWebinarModal__successIcon">
              <i className="fa-solid fa-check" />
            </div>
            <div className="englishtaWebinarModal__head englishtaWebinarModal__head--success">
              <p>Registration Submitted</p>
              <h2 id="webinar-success-title">Thank you for your response</h2>
            </div>
            <p className="englishtaWebinarModal__successText">
              We have received your webinar registration successfully.
            </p>
            <button type="button" className="englishtaWebinarModal__submit" onClick={closeSuccessModal}>
              Close
              <i className="fa-solid fa-arrow-right" />
            </button>
          </div>
        </div>
      ) : null}
      <Footer />
    </>
  );
};

export default WebinarPage;
