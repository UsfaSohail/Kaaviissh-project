import { Outlet, Link } from "react-router-dom";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center border-b border-border bg-background/80 px-4 backdrop-blur-sm">
          <SidebarTrigger className="mr-4" />
          <h1 className="text-lg font-bold text-foreground">Admin Dashboard</h1>
          <Link to="/" className="ml-auto text-sm text-muted-foreground transition-colors hover:text-primary">
            ← Back to Site
          </Link>
        </header>
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
