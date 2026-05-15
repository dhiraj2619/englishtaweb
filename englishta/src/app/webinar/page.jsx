import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tutorImage =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=85";

const webinars = [
  {
    date: "25 May, 2025",
    time: "7:00 PM IST",
    title: "Speak English Confidently in Daily Life",
    text: "Learn simple strategies to speak English fluently and confidently in everyday conversations.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  },
  {
    date: "08 June, 2025",
    time: "7:00 PM IST",
    title: "Ace Your English Interview",
    text: "Master common interview questions and improve your responses with expert tips.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
  },
  {
    date: "22 June, 2025",
    time: "7:00 PM IST",
    title: "Expand Vocabulary The Smart Way",
    text: "Learn techniques to build strong vocabulary and use it naturally in conversations.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80",
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

const WebinarPage = () => {
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
                <a href="/contact-us">
                  Register for Free
                  <i className="fa-solid fa-arrow-right" />
                </a>
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
              {webinars.map((webinar, index) => (
                <article
                  className="englishtaWebinarCard wow fadeInUp"
                  data-wow-duration="1s"
                  data-wow-delay={`${0.15 + index * 0.1}s`}
                  key={webinar.title}
                >
                  <div className="englishtaWebinarCard__media">
                    <img src={webinar.image} alt={webinar.title} />
                    <span>Live</span>
                    <div className="englishtaWebinarCard__content">
                      <p><i className="fa-regular fa-calendar" />{webinar.date}</p>
                      <p><i className="fa-regular fa-clock" />{webinar.time}</p>
                      <h3>{webinar.title}</h3>
                      <p>{webinar.text}</p>
                    </div>
                  </div>
                  <div className="englishtaWebinarCard__footer">
                    <div>
                      <img src={tutorImage} alt="Prof. Raj Shelke" />
                      <span>
                        <strong>Prof. Raj Shelke</strong>
                        15+ Years of Experience
                      </span>
                    </div>
                    <a href="/contact-us">
                      Register Now
                      <i className="fa-solid fa-arrow-right" />
                    </a>
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
            <div className="englishtaWebinarDots">
              <span />
              <span className="active" />
              <span />
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
              <a href="/contact-us">
                Join Your Next Webinar
                <i className="fa-solid fa-arrow-right" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default WebinarPage;
