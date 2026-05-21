import Navbar from "./Navbar";

export default function HeroBanner() {
  return (

    <>
      <section className="histudy-showcase" aria-label="Englishta spoken English platform">


        <div className="histudy-hero">
          <div className="histudy-copy">
            <p className="histudy-eyebrow">
              Spoken English &amp; Communication Training
            </p>
            <h1 className="histudy-title">
              Learn Fluent English With <span>Practical Training.</span>
            </h1>
            <div className="histudy-actions">
              <a href="/webinar" className="histudy-action-btn primary">
                <i className="fa-regular fa-calendar-days" />
                Join Free Webinar
              </a>
              <a href="/courses" className="histudy-action-btn">
                <i className="fa-solid fa-graduation-cap" />
                Explore Courses
              </a>
            </div>
            <div className="histudy-stats" aria-label="Englishta training stats">
              <div className="histudy-stat">
                <i className="fa-solid fa-users" />
                <span>
                  <strong>1000+</strong>Students Trained
                </span>
              </div>
              <div className="histudy-stat">
                <i className="fa-solid fa-award" />
                <span>
                  <strong>5+</strong>Years Experience
                </span>
              </div>
              <div className="histudy-stat">
                <i className="fa-solid fa-star" />
                <span>
                  <strong>95%</strong>Success Rate
                </span>
              </div>
            </div>
          </div>

          <div className="histudy-visual">
            <img
              src="/assets/images/rightsidebanner1.png"
              className="histudy-right-banner"
              alt="Englishta spoken English training"
            />
          </div>


        </div>
      </section>

      <section>
        <div className="container">
          <div className="histudy-feature-strip">
            <div className="histudy-feature">
              <i className="fa-solid fa-laptop" />
              <span>Live Online Classes</span>
            </div>
            <div className="histudy-feature">
              <i className="fa-solid fa-people-group" />
              <span>Live Practice Sessions</span>
            </div>
            <div className="histudy-feature">
              <i className="fa-regular fa-id-badge" />
              <span>Certificate Provided</span>
            </div>
            <div className="histudy-feature">
              <i className="fa-solid fa-headset" />
              <span>Doubt Solving Support</span>
            </div>
          </div>
        </div>
      </section>
    </>

  );
}
