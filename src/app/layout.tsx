import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Toaster } from "sonner";
export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
 return <div className="admin-shell flex min-h-screen flex-col md:flex-row"><AdminSidebar/><div className="min-w-0 flex-1"><AdminTopbar/><main className="overflow-x-hidden p-5 sm:p-7 md:p-10">{children}</main></div><Toaster theme="light" position="bottom-right" richColors/></div>;
}
