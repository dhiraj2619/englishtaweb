import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Student Profile | Englishta",
};

export default function StudentProfilePage() {
  return (
    <>
      <Navbar />
      <main className="englishtaStudentShell">
        <div className="container">
          <section className="englishtaStudentPanel">
            <p className="englishtaStudentPanel__eyebrow">Student Profile</p>
            <h1>Your Learning Profile</h1>
            <p>
              This profile area will show student details, learning preferences, course history, and account information.
            </p>

            <div className="englishtaStudentPanel__grid">
              <div className="englishtaStudentPanel__card">
                <i className="fa-regular fa-user" aria-hidden="true" />
                <strong>Personal Details</strong>
                <span>Name, email, phone number, and basic student information.</span>
              </div>
              <div className="englishtaStudentPanel__card">
                <i className="fa-solid fa-language" aria-hidden="true" />
                <strong>Learning Preferences</strong>
                <span>Preferred language, goals, and communication needs.</span>
              </div>
              <div className="englishtaStudentPanel__card">
                <i className="fa-solid fa-shield-halved" aria-hidden="true" />
                <strong>Account Status</strong>
                <span>Login status and profile completion details.</span>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
