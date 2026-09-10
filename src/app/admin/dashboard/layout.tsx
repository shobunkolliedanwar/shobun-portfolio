import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Toaster } from "sonner";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg md:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 md:p-8">{children}</main>
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}
