import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tutorImage =
  "/assets/images/raajshlke.png";

const stats = [
  ["fa-regular fa-user", "10,000+", "Happy Learners"],
  ["fa-solid fa-chalkboard-user", "2,500+", "Live Classes Conducted"],
  ["fa-regular fa-circle-play", "1,000+", "Practice Videos & Lessons"],
  ["fa-solid fa-globe", "45+", "Countries Reached"],
  ["fa-regular fa-star", "4.9/5", "Learner Rating"],
];

const faqs = [
  ["Who can join Englishta?", "Anyone who wants to speak English confidently for study, work, interviews, or daily conversations can join."],
  ["What will I learn in the live classes?", "You will practice speaking, pronunciation, vocabulary, grammar usage, interview answers, and real-life conversations."],
  ["Are the classes really interactive?", "Yes. Sessions focus on speaking practice, personal correction, and confidence-building activities."],
  ["Will I get personal feedback?", "Yes. Learners receive practical feedback on fluency, clarity, grammar, and pronunciation."],
  ["How can I join a batch?", "You can book a free demo class and our team will help you choose the right batch."],
];

const AboutUsPage = () => {
  return (
    <>
      <Navbar />
      <main className="englishtaAboutPage">
        <section className="englishtaAboutHero">
          <div className="container">
            <div className="englishtaAboutHero__copy wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.15s">
              <p className="englishtaAboutEyebrow">About Us</p>
              <h1>
                Helping You Speak English <span>Confidently.</span>
                <strong>Anywhere, Anytime.</strong>
              </h1>
              <div className="englishtaAboutLine" />
              <p>
                Englishta is an online English speaking platform founded with a simple mission - to help learners speak
                English confidently in real-life situations. We believe language opens doors, and we are here to help you
                walk through them.
              </p>
            </div>

            <div className="englishtaAboutHero__visual wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.25s">
              <div className="englishtaAboutDots" />
              <div className="englishtaAboutHero__photo">
                <img src={tutorImage} alt="Prof. Raj Shelke" />
              </div>
              <div className="englishtaAboutHero__badge">
                <span>Founder & Tutor</span>
                <strong>Prof. Raj Shelke</strong>
                <p>10,000+ Learners Guided</p>
                <p>15+ Years of Teaching Experience</p>
              </div>
            </div>
          </div>
        </section>

        <section className="englishtaAboutStats">
          <div className="container">
            <div className="englishtaAboutStats__panel wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.15s">
              <h2>
                <span>Our</span> Engagements
              </h2>
              <div className="englishtaAboutStats__grid">
                {stats.map(([icon, value, label], index) => (
                  <div
                    className="englishtaAboutStat wow fadeInUp"
                    data-wow-duration="1s"
                    data-wow-delay={`${0.15 + index * 0.08}s`}
                    key={label}
                  >
                    <i className={icon} />
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="englishtaAboutMission">
          <div className="container">
            <h2 className="wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s">
              Our <span>Mission & Vision</span>
            </h2>
            <div className="englishtaAboutLine englishtaAboutLine--center" />
            <div className="englishtaAboutMission__grid">
              <article className="wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.15s">
                <i className="fa-solid fa-bullseye" />
                <h3>Our Mission</h3>
                <p>
                  To empower learners with practical English speaking skills through interactive sessions, personalized
                  feedback, and real-life conversations.
                </p>
              </article>
              <article className="wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.25s">
                <i className="fa-regular fa-eye" />
                <h3>Our Vision</h3>
                <p>
                  To become India&apos;s most trusted platform for English communication and help millions speak English
                  with confidence.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="englishtaAboutTutor">
          <div className="container">
            <h2 className="wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s">
              Meet Your <span>Tutor</span>
            </h2>
            <div className="englishtaAboutLine englishtaAboutLine--center" />
            <div className="englishtaAboutTutor__grid">
              <div className="englishtaAboutTutor__image wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.15s">
                <div className="englishtaAboutDots englishtaAboutDots--left" />
                <img src={tutorImage} alt="Prof. Raj Shelke" />
              </div>
              <div className="englishtaAboutTutor__copy wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.25s">
                <h3>Prof. Raj Shelke</h3>
                <p className="englishtaAboutTutor__role">Founder & English Communication Expert</p>
                <p>
                  With over 15 years of teaching experience, Prof. Raj Shelke has helped thousands of learners overcome
                  their fear of speaking English. His practical methods, friendly approach, and real-life examples make
                  learning simple, effective, and enjoyable.
                </p>
                <div className="englishtaAboutTutor__points">
                  <span><i className="fa-solid fa-check" />15+ Years of Experience</span>
                  <span><i className="fa-solid fa-check" />Personalized Guidance</span>
                  <span><i className="fa-solid fa-check" />Expert in Spoken English</span>
                  <span><i className="fa-solid fa-check" />Real-life Communication Focus</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="englishtaAboutFaq">
          <div className="container">
            <div className="englishtaAboutFaq__main wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.15s">
              <h2>
                Frequently Asked <span>Questions</span>
              </h2>
              <div className="englishtaAboutLine englishtaAboutLine--center" />
              <div className="englishtaAboutFaq__list">
                {faqs.map(([question, answer]) => (
                  <details key={question}>
                    <summary>{question}</summary>
                    <p>{answer}</p>
                  </details>
                ))}
              </div>
            </div>

            <aside className="englishtaAboutCta wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.25s">
              <h3>
                Ready to Speak English With <span>Confidence?</span>
              </h3>
              <img src="/assets/images/aboutenglishta.png" alt="Englishta mascot" />
              <p>Join our live batches and start your speaking journey today!</p>
              <a href="/contact-us">
                Join Your Batch Now
                <i className="fa-solid fa-arrow-right" />
              </a>
              <ul>
                <li>Live Classes</li>
                <li>Expert Guidance</li>
                <li>Real Results</li>
              </ul>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AboutUsPage;
