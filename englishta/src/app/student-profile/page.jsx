import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StudentProfileDashboard from "./StudentProfileDashboard";

export const metadata = {
  title: "Student Profile | Englishta",
};

export default function StudentProfilePage() {
  return (
    <>
      <Navbar />
      <main className="englishtaStudentProfilePage">
        <StudentProfileDashboard />
      </main>
      <Footer />
    </>
  );
}
