import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { patientInfo } from "@/lib/mockData";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4 shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="h-6 w-px bg-border" />
              <span className="text-sm text-muted-foreground font-medium">
                Monitoring: <span className="text-foreground font-semibold">{patientInfo.name}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse-dot" />
                System Active
              </span>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
