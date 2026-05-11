import Navbar from "@/components/Navbar";
import HeroBanner from "../components/HeroBanner";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroBanner />;


      <section class="englishta-about" aria-label="About Englishta">
        <div class="container">
          <div class="englishta-about-grid">
            <div class="englishta-about-content">
              <p class="englishta-about-kicker">About Us</p>
              <h2 class="englishta-about-title">
                The Practical Spoken English Academy for
                <span>Confident Communication</span>
              </h2>
              <p class="englishta-about-text">
                Englishta helps learners speak English naturally through guided
                practice, grammar correction, pronunciation training, interview
                preparation, and real conversation sessions.
              </p>

              <div class="englishta-program-list">
                <a href="courses-grid-view.html" class="englishta-program-card">
                  <span class="englishta-program-icon">
                    <i class="fa-solid fa-comments"></i>
                  </span>
                  <div class="englishta-program-body">
                    <h3>Spoken English Program</h3>
                    <p>
                      Daily speaking practice, fluency building, and confidence
                      training.
                    </p>
                  </div>
                  <span class="englishta-program-arrow">
                    <i class="fa-solid fa-arrow-right"></i>
                  </span>
                </a>

                <a
                  href="courses-grid-view.html"
                  class="englishta-program-card secondary"
                >
                  <span class="englishta-program-icon">
                    <i class="fa-solid fa-briefcase"></i>
                  </span>
                  <div class="englishta-program-body">
                    <h3>Interview &amp; Corporate English</h3>
                    <p>
                      Professional communication for jobs, meetings, and
                      presentations.
                    </p>
                  </div>
                  <span class="englishta-program-arrow">
                    <i class="fa-solid fa-arrow-right"></i>
                  </span>
                </a>
              </div>
            </div>

            <div class="englishta-about-media">
              <span class="englishta-dot-pattern" aria-hidden="true"></span>
              <div class="englishta-about-image">
                <img
                  src="assets/images/rightsidebanner1.png"
                  alt="Englishta English communication training"
                />
                <a
                  href="event.html"
                  class="englishta-play"
                  aria-label="Watch Englishta introduction"
                >
                  <i class="fa-solid fa-play"></i>
                </a>
              </div>
              <div class="englishta-about-note">
                <span class="englishta-note-icon">
                  <i class="fa-solid fa-quote-right"></i>
                </span>
                <div class="englishta-quote-rotator">
                  <div class="englishta-quote-item">
                    <h3>Learn confidently. Speak naturally. Succeed globally.</h3>
                    <p>
                      Smart English coaching for students, working professionals,
                      and entrepreneurs.
                    </p>
                  </div>
                  <div class="englishta-quote-item">
                    <h3>
                      Improve communication. Build confidence. Unlock
                      opportunities.
                    </h3>
                    <p>
                      Practical spoken English classes designed for real-life
                      conversations.
                    </p>
                  </div>
                  <div class="englishta-quote-item">
                    <h3>Speak fluently. Present boldly. Grow professionally.</h3>
                    <p>
                      English training focused on career, interviews, and public
                      speaking.
                    </p>
                  </div>
                  <div class="englishta-quote-item">
                    <h3>Practice daily. Correct mistakes. Speak with clarity.</h3>
                    <p>
                      Guided communication training with grammar, vocabulary, and
                      pronunciation support.
                    </p>
                  </div>
                  <div class="englishta-quote-item">
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
    </>

  )
}
