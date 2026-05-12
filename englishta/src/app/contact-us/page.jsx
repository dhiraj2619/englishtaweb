import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ContactUs = () => {
  return (
    <>
      <Navbar />
      <main className="englishta-contact-page">
        <section className="englishta-contact-hero">
          <div className="container">
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
              <div className="englishta-contact-info">
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

              <form className="englishta-contact-form">
                <div className="englishta-form-row">
                  <label>
                    Full Name
                    <input type="text" name="name" placeholder="Your name" />
                  </label>
                  <label>
                    Phone Number
                    <input type="tel" name="phone" placeholder="Your mobile number" />
                  </label>
                </div>
                <label>
                  Email Address
                  <input type="email" name="email" placeholder="you@example.com" />
                </label>
                <label>
                  Course Interest
                  <select name="interest" defaultValue="">
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
                <label>
                  Message
                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Tell us what you want to improve"
                  />
                </label>
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
