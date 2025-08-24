import { Calendar, Star } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function Upcoming() {
  return (
    <div className="flex flex-col h-full p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Upcoming Adventures</h1>
        <p className="text-muted-foreground">Your future climbing plans and events</p>
      </div>

      {/* Coming Soon Card */}
      <div className="flex-1 flex items-center justify-center">
        <Card className="p-12 text-center max-w-md mx-auto bg-gradient-to-br from-blue-50/10 to-indigo-50/5 border-indigo-200/20">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <Calendar className="h-24 w-24 text-indigo-400/60" />
              <Star className="h-8 w-8 text-primary absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Coming Soon
          </h2>
          
          <p className="text-muted-foreground mb-6">
            We're preparing more amazing features for your climbing adventures. 
            Soon you'll be able to plan and track all your upcoming climbs!
          </p>
          
          <div className="text-6xl mb-4 animate-pulse">
            🧗‍♂️
          </div>
          
          <p className="text-sm text-muted-foreground italic">
            "The best climbs are the ones we're looking forward to..."
          </p>
        </Card>
      </div>
    </div>
  )
}
