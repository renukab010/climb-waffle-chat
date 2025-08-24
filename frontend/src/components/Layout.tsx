import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Menu } from "lucide-react"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background relative">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Fixed Header with sidebar trigger */}
          <header className="sticky top-0 h-14 flex items-center justify-between px-4 border-b border-border bg-card/95 backdrop-blur-sm">
            <SidebarTrigger className="flex items-center gap-2 hover:bg-muted/50 rounded-lg p-2 transition-colors">
              <Menu className="h-5 w-5" />
              <span className="text-sm font-medium">Menu</span>
            </SidebarTrigger>
            
            <div className="text-md text-muted-foreground">
              Climbing Waffle
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}