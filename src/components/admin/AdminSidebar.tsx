import {
  LayoutDashboard, Briefcase, FileText, DollarSign, Users,
  BarChart3, CreditCard, MessageSquare, Package, FileEdit, LogOut
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import LogoutDialog from "@/components/LogoutDialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Cases", url: "/admin/cases", icon: Briefcase },
  { title: "Blogs", url: "/admin/blogs", icon: FileText },
  { title: "Donations", url: "/admin/donations", icon: DollarSign },
  { title: "Applications", url: "/admin/applications", icon: Users },
  { title: "Impact Counter", url: "/admin/impact", icon: BarChart3 },
  { title: "Payment Methods", url: "/admin/payment-methods", icon: CreditCard },
  { title: "Chat Inbox", url: "/admin/chat", icon: MessageSquare },
  { title: "Ration Bag", url: "/admin/ration-bag", icon: Package },
  { title: "Legal Content", url: "/admin/legal", icon: FileEdit },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = async () => {
    setLogoutOpen(false);
    await signOut();
    navigate("/");
  };

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/admin"}
                        className="hover:bg-muted/50"
                        activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button onClick={() => setLogoutOpen(true)} className="flex items-center w-full hover:bg-muted/50 px-2 py-1.5 rounded-md text-muted-foreground hover:text-foreground">
                      <LogOut className="mr-2 h-4 w-4" />
                      {!collapsed && <span>Logout</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <LogoutDialog open={logoutOpen} onConfirm={handleLogout} onCancel={() => setLogoutOpen(false)} />
    </>
  );
}