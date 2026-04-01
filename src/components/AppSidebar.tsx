import { LayoutDashboard, Users, AlertTriangle, MapPin, Brain, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { patientInfo } from "@/lib/mockData";

const navItems = [
  { title: "Live Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Recognition", url: "/recognition", icon: Users },
  { title: "Alert Log", url: "/alerts", icon: AlertTriangle },
  { title: "Geofence", url: "/geofence", icon: MapPin },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="bg-sidebar pt-6">
        {/* Branding */}
        <div className="px-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
              <Brain className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-sm font-bold text-sidebar-primary-foreground font-heading">MemoryGuard</h1>
                <p className="text-xs text-sidebar-foreground/60">Patient Monitor</p>
              </div>
            )}
          </div>
        </div>

        {/* Patient info */}
        {!collapsed && (
          <div className="px-4 mb-6">
            <div className="bg-sidebar-accent rounded-lg p-3">
              <p className="text-xs text-sidebar-foreground/60 uppercase tracking-wider mb-1">Patient</p>
              <p className="text-sm font-semibold text-sidebar-accent-foreground">{patientInfo.name}</p>
              <p className="text-xs text-sidebar-foreground/60">{patientInfo.condition}</p>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/50 text-sidebar-foreground transition-colors"
                      activeClassName="bg-sidebar-primary/20 text-sidebar-primary-foreground font-medium"
                    >
                      <item.icon className="mr-3 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto px-2 pb-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/" className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50">
                  <LogOut className="mr-3 h-4 w-4 shrink-0" />
                  {!collapsed && <span>Logout</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
