import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tutorImage =
  "/assets/images/raajshlke.png";

const stats = [
  ["fa-regular fa-user", "5+ Lakh", "Learners Guided"],
  ["fa-solid fa-chalkboard-user", "28+ Years", "Teaching & Training"],
  ["fa-solid fa-building-columns", "Founder", "GuruMantra Knowledge Institute"],
  ["fa-solid fa-pen-nib", "Author", "Poet • Trainer • Speaker"],
  ["fa-regular fa-star", "BEC", "University of Cambridge"],
];

const profileHighlights = [
  "Founder Director - GuruMantra Knowledge Institute",
  "Master's Degree in English Literature",
  "First Rank in District during Teachers' Training",
  "BEC - Business English Certificate, University of Cambridge",
  "Member of the All India English Language Teachers' Association",
];

const profileSections = [
  {
    title: "28+ Years of Teaching & Training Experience",
    text:
      "For nearly three decades, Prof. Raj Shelke has taught English communication skills to learners ranging from beginners to advanced-level speakers. His experience includes training students, teachers, faculty members, working professionals, and English-medium school teachers.",
  },
  {
    title: "Educational Leadership & Social Impact",
    text:
      "He has served as an Honourable Principal at a CBSE school and junior college, and has also worked extensively for the educational upliftment of students in tribal regions of Maharashtra for five years.",
  },
  {
    title: "Impact on Students & Professionals",
    text:
      "Through seminars, workshops, and training programmes over the last 20 years, Prof. Raj Shelke has helped more than 5 lakh learners improve their English communication and confidence, including professionals from sectors such as the IT industry.",
  },
  {
    title: "Teaching Philosophy",
    text:
      "He believes language learning should be simple, enjoyable, practical, and confidence-building. Fluent in English, Hindi, and Marathi, he creates a comfortable learning atmosphere focused on real-life communication needs.",
  },
  {
    title: "Author, Poet & Columnist",
    text:
      "Prof. Raj Shelke is the author of the bestselling books Best of Luck - English is Easy! and Ujed Perat Jato - Sowing the Seeds of Light. He has translated more than 20 books between Marathi, Hindi, and English, writes on social issues, and has authored an English Communication Skills book for B.A. students for a renowned university.",
  },
];

const awards = [
  "Shabda Gandha Award",
  "Shabda Pera Award",
  "Late Daulatrao Gaikwad Award",
  "Shiva Garjana Award",
  "Shabda Prabha Award",
];

const faqs = [
  ["Who can join Englishta?", "Anyone who wants to speak English confidently for study, work, interviews, or daily conversations can join."],
  ["What will I learn in the live classes?", "You will practice speaking, pronunciation, vocabulary, grammar usage, interview answers, and real-life conversations."],
  ["Are the classes really interactive?", "Yes. Sessions focus on speaking practice, personal correction, and confidence-building activities."],
  ["Will I get personal feedback?", "Yes. Learners receive practical feedback on fluency, clarity, grammar, and pronunciation."],
  ["How can I join a batch?", "You can book a free demo class and our team will help you choose the right batch."],
];

const whyEnglishtaFeatures = [
  ["fa-solid fa-comments", "Interaction", "Students do not sit silently - they talk, respond, and engage throughout the session."],
  ["fa-solid fa-microphone-lines", "Speaking Practice", "Every class includes real speaking activities, not just theory."],
  ["fa-solid fa-bolt", "Confidence Building", "Learners slowly remove fear and start speaking without hesitation."],
  ["fa-regular fa-face-smile", "Humour & Enjoyment", "Light humour makes learning stress-free and enjoyable."],
  ["fa-solid fa-hands-holding-circle", "Comfort Zone Learning", "No pressure, no fear - learners feel safe to try and improve."],
  ["fa-solid fa-people-arrows", "Participation", "Every student gets a chance to speak - not just observe."],
];

const whyEnglishtaPoints = [
  "Speak Naturally",
  "Learn from Real Situations",
  "Daily Speaking Practice",
  "Indian Learner Friendly Method",
  "Live Feedback & Correction",
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
                <span>Founder & Mentor</span>
                <strong>Prof. Raj Shelke</strong>
                <p>5+ Lakh Learners Guided</p>
                <p>28+ Years of Teaching Experience</p>
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
              Meet Your <span>Mentor</span>
            </h2>
            <div className="englishtaAboutLine englishtaAboutLine--center" />
            <div className="englishtaAboutTutor__grid">
              <div className="englishtaAboutTutor__image wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.15s">
                <div className="englishtaAboutDots englishtaAboutDots--left" />
                <img src={tutorImage} alt="Prof. Raj Shelke" />
              </div>
              <div className="englishtaAboutTutor__copy wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.25s">
                <h3>Prof. Raj Shelke</h3>
                <p className="englishtaAboutTutor__role">Founder Director, GuruMantra Knowledge Institute</p>
                <p>
                  Prof. Rajeshwar Shashikala Pandurang Shelke, popularly known as Prof. Raj Shelke Sir, is a renowned
                  English Communication Trainer, educator, author, poet, translator, columnist, and motivational speaker
                  with over 28 years of experience in teaching, training, and inspiring learners from diverse
                  backgrounds.
                </p>
                <div className="englishtaAboutTutor__points">
                  <span><i className="fa-solid fa-check" />28+ Years Experience</span>
                  <span><i className="fa-solid fa-check" />5+ Lakh Learners Guided</span>
                  <span><i className="fa-solid fa-check" />Author • Poet • Trainer • Speaker</span>
                  <span><i className="fa-solid fa-check" />Confidence & Communication Focus</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="englishtaAboutProfile" id
        ="founderprofile">
          <div className="container">
            <div className="englishtaAboutProfile__intro wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s">
              <p className="englishtaAboutEyebrow">Founder Profile</p>
              <h2>
                Prof. Raj Shelke <span>Sir</span>
              </h2>
              <p>
                Founder Director, GuruMantra Knowledge Institute | English Communication Trainer | Author | Poet |
                Motivational Speaker
              </p>
            </div>

            <div className="englishtaAboutProfile__grid">
              <article className="englishtaAboutProfile__card englishtaAboutProfile__card--wide wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.15s">
                <h3>Academic Excellence</h3>
                <p>
                  Prof. Raj Shelke holds a Master&apos;s Degree in English Literature and secured First Rank in the
                  District during his Teachers&apos; Training programme. He has also earned the prestigious BEC
                  (Business English Certificate) awarded by University of Cambridge.
                </p>
                <ul>
                  {profileHighlights.map((item) => (
                    <li key={item}><i className="fa-solid fa-check" />{item}</li>
                  ))}
                </ul>
              </article>

              <aside className="englishtaAboutProfile__focus wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.2s">
                <strong>Focus</strong>
                <span>28+ Years Experience</span>
                <span>5+ Lakh Learners Guided</span>
                <span>Founder Director - GuruMantra Knowledge Institute</span>
                <span>Author • Poet • Trainer • Speaker</span>
              </aside>
            </div>

            <div className="englishtaAboutProfile__sections">
              {profileSections.map((section, index) => (
                <article
                  className="wow fadeInUp"
                  data-wow-duration="1s"
                  data-wow-delay={`${0.12 + index * 0.05}s`}
                  key={section.title}
                >
                  <h3>{section.title}</h3>
                  <p>{section.text}</p>
                </article>
              ))}
            </div>

            <div className="englishtaAboutProfile__recognition">
              <article className="wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.15s">
                <h3>Awards & Recognition</h3>
                <ul>
                  {awards.map((award) => (
                    <li key={award}><i className="fa-solid fa-award" />{award}</li>
                  ))}
                </ul>
              </article>
              <article className="wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.2s">
                <h3>Connect with Prof. Raj Shelke</h3>
                <p>
                  Follow Prof. Raj Shelke Sir on social media platforms for English learning guidance, motivational
                  content, communication tips, poetry, and educational insights.
                </p>
                <blockquote>
                  Teaching English beyond grammar - for confidence, expression, and success.
                </blockquote>
              </article>
            </div>
          </div>
        </section>

        <section className="englishtaWhyChoose" id="whychooseenglishta">
          <div className="container">
            <div className="englishtaWhyChoose__intro wow fadeInUp" data-aos="fade-up" data-wow-duration="1s" data-wow-delay="0.1s">
              {/* <p className="englishtaAboutEyebrow">Why Englishta?</p> */}
              <h2>
                Why <span>Englishta?</span>
              </h2>
              <p>
                At Englishta, learning English is not just about studying rules - it is about experiencing the
                language.
              </p>
              <p>
                Your class becomes a place where learners do not just listen. They speak, interact, enjoy, and
                grow in confidence.
              </p>
            </div>

            <div className="englishtaWhyChoose__features" aria-label="What makes Englishta different">
              {whyEnglishtaFeatures.map(([icon, title, text], index) => (
                <article
                  className="wow fadeInUp"
                  data-aos="fade-up"
                  data-wow-duration="1s"
                  data-wow-delay={`${0.12 + index * 0.05}s`}
                  key={title}
                >
                  <i className={icon} aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>

            <div className="englishtaWhyChoose__result wow fadeInUp" data-aos="fade-up" data-wow-duration="1s" data-wow-delay="0.15s">
              <div>
                <p className="englishtaAboutEyebrow">The Real Result</p>
                <h3>Learning Feels Alive</h3>
                <p>
                  At Englishta, learners do not remember just what was taught. They remember the experience of
                  learning. Because when learning feels alive, English becomes natural.
                </p>
              </div>
              <ul>
                {whyEnglishtaPoints.map((point) => (
                  <li key={point}><i className="fa-solid fa-check" aria-hidden="true" />{point}</li>
                ))}
              </ul>
            </div>

            <blockquote className="englishtaWhyChoose__quote wow fadeInUp" data-aos="fade-up" data-wow-duration="1s" data-wow-delay="0.18s">
              <p>You do not just learn English at Englishta - you start living it with confidence.</p>
              <strong>Simple teaching that finally makes English understandable.</strong>
            </blockquote>
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
              <a href="/courses">
                Join Your Batch Now
                <i className="fa-solid fa-arrow-right" />
              </a>
              {/* <ul>
                <li>Live Classes</li>
                <li>Expert Guidance</li>
                <li>Real Results</li>
              </ul> */}
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AboutUsPage;
