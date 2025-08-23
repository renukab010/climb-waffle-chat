import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Menu } from "lucide-react"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Fixed Header with sidebar trigger */}
          <header className="fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-4 border-b border-border bg-card/95 backdrop-blur-sm z-30">
            <SidebarTrigger className="flex items-center gap-2 hover:bg-muted/50 rounded-lg p-2 transition-colors">
              <Menu className="h-5 w-5" />
              <span className="text-sm font-medium">Menu</span>
            </SidebarTrigger>
            
            <div className="text-xs text-muted-foreground">
              Climbing Waffle PWA
            </div>
          </header>

          {/* Main content - adjusted for fixed header */}
          <main className="flex-1 pt-14">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}