import { Construction, Hammer } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function Settings() {
  return (
    <div className="flex flex-col h-full p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Customize your Climbing Waffle experience</p>
      </div>

      {/* Construction Card */}
      <div className="flex-1 flex items-center justify-center">
        <Card className="p-12 text-center max-w-md mx-auto bg-gradient-to-br from-waffle/10 to-sunset/5 border-sunset/20">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <Hammer className="h-24 w-24 text-sunset/60" />
              <Construction className="h-8 w-8 text-primary absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Under Construction
          </h2>
          
          <p className="text-muted-foreground mb-6">
            We're busy building amazing settings for your climbing adventures. 
            Check back soon for customization options!
          </p>
          
          <div className="text-6xl mb-4 animate-pulse">
            🏗️
          </div>
          
          <p className="text-sm text-muted-foreground italic">
            "Every great climb starts with proper preparation..."
          </p>
        </Card>
      </div>
    </div>
  )
}