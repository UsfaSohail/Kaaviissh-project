import {
  LayoutDashboard, Briefcase, FileText, DollarSign, Users,
  BarChart3, Calculator, Image, CreditCard, MessageSquare,
  Package, FileEdit, Quote
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
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
  { title: "Zakat Rates", url: "/admin/zakat-rates", icon: Calculator },
  { title: "Gallery", url: "/admin/gallery", icon: Image },
  { title: "Payment Methods", url: "/admin/payment-methods", icon: CreditCard },
  { title: "Chat Inbox", url: "/admin/chat", icon: MessageSquare },
  { title: "Ration Bag", url: "/admin/ration-bag", icon: Package },
  { title: "Site Content", url: "/admin/site-content", icon: FileEdit },
  { title: "Quotes", url: "/admin/quotes", icon: Quote },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
