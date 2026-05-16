import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/adminAuth";
import AdminDashboard from "@/components/admin/AdminDashboard";
import "./admin.css";

export const metadata = {
  title: "Admin Dashboard | EnglishTa",
};

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  return <AdminDashboard />;
}
