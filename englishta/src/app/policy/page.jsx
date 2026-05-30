import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Policies | Englishta",
  description: "Privacy Policy, Terms and Conditions, and Refund Policy for Englishta.",
};

export default function PolicyPage() {
  return (
    <>
      <Navbar />
      <main className="englishtaPolicyPage">
        <section className="englishtaPolicyHero">
          <div className="container">
            <p>Legal Information</p>
            <h1>Policies</h1>
            <span>Privacy Policy, Terms &amp; Conditions, and Refund / Cancellation Policy.</span>
          </div>
        </section>

        <section className="englishtaPolicyContent">
          <div className="container">
            <article>
              <h2>Privacy Policy</h2>
              <p>
                This website, englishta4u.com, is owned and operated by Gurumantra Knowledge Institute.
              </p>
              <p>
                We collect basic user information such as name, mobile number, email address, and payment details for
                course registration and communication purposes only.
              </p>
              <p>
                We do not sell or share personal information with third parties except where required for payment
                processing or legal compliance.
              </p>
              <p>By using this website, you agree to our privacy practices.</p>
            </article>

            <article>
              <h2>Terms &amp; Conditions</h2>
              <p>
                By accessing and using englishta4u.com, you agree to follow the terms and conditions mentioned on this
                website.
              </p>
              <p>
                All courses, materials, and sessions provided by Englishta are intended for educational purposes only.
              </p>
              <p>
                Englishta reserves the right to modify course schedules, fees, or policies when necessary.
              </p>
              <p>This website is operated by Gurumantra Knowledge Institute.</p>
            </article>

            <article>
              <h2>Refund / Cancellation Policy</h2>
              <p>Fees once paid are generally non-refundable.</p>
              <p>
                However, in exceptional situations, refund requests may be reviewed at the sole discretion of
                Englishta/Gurumantra Knowledge Institute.
              </p>
              <p>
                For any payment-related concerns, contact us at:{" "}
                <a href="mailto:support@englishta4u.com">support@englishta4u.com</a>
              </p>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
