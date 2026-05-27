import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "My Progress | Englishta",
};

export default function MyProgressPage() {
  return (
    <>
      <Navbar />
      <main className="englishtaStudentShell">
        <div className="container">
          <section className="englishtaStudentPanel">
            <p className="englishtaStudentPanel__eyebrow">My Progress</p>
            <h1>Track Your English Growth</h1>
            <p>
              This progress area will show course completion, practice activity, speaking confidence, and learning milestones.
            </p>

            <div className="englishtaStudentPanel__grid">
              <div className="englishtaStudentPanel__card">
                <i className="fa-solid fa-chart-line" aria-hidden="true" />
                <strong>Course Progress</strong>
                <span>Track lessons completed and active course status.</span>
              </div>
              <div className="englishtaStudentPanel__card">
                <i className="fa-solid fa-microphone-lines" aria-hidden="true" />
                <strong>Speaking Practice</strong>
                <span>Review practice sessions and fluency improvement.</span>
              </div>
              <div className="englishtaStudentPanel__card">
                <i className="fa-solid fa-award" aria-hidden="true" />
                <strong>Milestones</strong>
                <span>Celebrate achievements and learning consistency.</span>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
