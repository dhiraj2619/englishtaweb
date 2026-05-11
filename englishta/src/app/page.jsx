import Navbar from "@/components/Navbar";
import HeroBanner from "../components/HeroBanner";
import FeaturedCoursesCarousel from "@/components/FeaturedCoursesCarousel";

const featuredCourses = [
  {
    title: "Spoken English Mastery",
    description: "Daily live speaking drills, fluency practice, and confidence building.",
    meta: "Beginner to Advanced",
    thumbnail: "/assets/images/rightsidebanner1.png",
  },
  {
    title: "Interview English",
    description: "Answer HR questions clearly and improve corporate communication skills.",
    meta: "Career Focused",
    thumbnail: "/assets/images/rightsidebanner1.png",
  },
  {
    title: "Public Speaking Boost",
    description: "Presentation structure, stage confidence, and spoken delivery practice.",
    meta: "Weekend Batch",
    thumbnail: "/assets/images/rightsidebanner1.png",
  },
  {
    title: "Listening & Pronunciation",
    description: "Accent clarity, listening drills, and pronunciation correction exercises.",
    meta: "Practical Sessions",
    thumbnail: "/assets/images/rightsidebanner1.png",
  },
  {
    title: "Grammar for Speaking",
    description: "Use grammar naturally in conversation without sounding memorized.",
    meta: "Structured Modules",
    thumbnail: "/assets/images/rightsidebanner1.png",
  },
  {
    title: "Business Communication",
    description: "Emails, meetings, introductions, and workplace English for professionals.",
    meta: "Professional Program",
    thumbnail: "/assets/images/rightsidebanner1.png",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroBanner />

      <section className="englishta-about" aria-label="About Englishta">
        <div className="container">
          <div className="englishta-about-grid">
            <div className="englishta-about-content">
              <p className="englishta-about-kicker">About Us</p>
              <h2 className="englishta-about-title">
                The Practical Spoken English Academy for
                <span>Confident Communication</span>
              </h2>
              <p className="englishta-about-text">
                Englishta helps learners speak English naturally through guided
                practice, grammar correction, pronunciation training, interview
                preparation, and real conversation sessions.
              </p>

              <div className="englishta-program-list">
                <a href="/courses" className="englishta-program-card">
                  <span className="englishta-program-icon">
                    <i className="fa-solid fa-comments"></i>
                  </span>
                  <div className="englishta-program-body">
                    <h3>Spoken English Program</h3>
                    <p>
                      Daily speaking practice, fluency building, and confidence
                      training.
                    </p>
                  </div>
                  <span className="englishta-program-arrow">
                    <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </a>

                <a
                  href="/courses"
                  className="englishta-program-card secondary"
                >
                  <span className="englishta-program-icon">
                    <i className="fa-solid fa-briefcase"></i>
                  </span>
                  <div className="englishta-program-body">
                    <h3>Interview &amp; Corporate English</h3>
                    <p>
                      Professional communication for jobs, meetings, and
                      presentations.
                    </p>
                  </div>
                  <span className="englishta-program-arrow">
                    <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </a>
              </div>
            </div>

            <div className="englishta-about-media">
              <span className="englishta-dot-pattern" aria-hidden="true"></span>
              <div className="englishta-about-image">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/M7lc1UVf-VE?rel=0"
                  title="Englishta introduction video preview"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
                <span className="englishta-video-badge">
                  <i className="fa-brands fa-youtube"></i>
                  Video Preview
                </span>
              </div>
              <div className="englishta-about-note">
                <span className="englishta-note-icon">
                  <i className="fa-solid fa-quote-right"></i>
                </span>
                <div className="englishta-quote-rotator">
                  <div className="englishta-quote-item">
                    <h3>Learn confidently. Speak naturally. Succeed globally.</h3>
                    <p>
                      Smart English coaching for students, working professionals,
                      and entrepreneurs.
                    </p>
                  </div>
                  <div className="englishta-quote-item">
                    <h3>
                      Improve communication. Build confidence. Unlock
                      opportunities.
                    </h3>
                    <p>
                      Practical spoken English classes designed for real-life
                      conversations.
                    </p>
                  </div>
                  <div className="englishta-quote-item">
                    <h3>Speak fluently. Present boldly. Grow professionally.</h3>
                    <p>
                      English training focused on career, interviews, and public
                      speaking.
                    </p>
                  </div>
                  <div className="englishta-quote-item">
                    <h3>Practice daily. Correct mistakes. Speak with clarity.</h3>
                    <p>
                      Guided communication training with grammar, vocabulary, and
                      pronunciation support.
                    </p>
                  </div>
                  <div className="englishta-quote-item">
                    <h3>
                      Think in English. Respond faster. Sound more confident.
                    </h3>
                    <p>
                      Conversation-based coaching for learners who want practical
                      fluency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="englishta-featured-courses" aria-label="Featured courses">
        <div className="container">
          <div className="englishta-featured-heading">
            <p className="englishta-featured-kicker">
              You don't need any external plugins.
            </p>
            <h2 className="englishta-featured-title">
              <span>100+</span> Courses included.
            </h2>
          </div>

          <FeaturedCoursesCarousel courses={featuredCourses} />
        </div>
      </section>
    </>
  );
}
