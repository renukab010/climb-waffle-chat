import { useState, useRef } from "react"
import { Send, Paperclip, Image, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  attachments?: { name: string; type: string; url: string }[]
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Welcome to Climbing Waffle! How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    }
  ])
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, newMessage])
    setInputText("")
    setIsLoading(true)

    // Simulate LLM response for now
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! To enable AI responses, please connect your Lovable project to Supabase using the green button in the top right corner.",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, response])
      setIsLoading(false)
    }, 1000)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      // For now, just show a toast - actual upload would need backend
      toast({
        title: "File selected",
        description: `${file.name} ready to send (backend integration needed)`,
      })
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Header - positioned to account for sidebar */}
      <div className="fixed top-14 left-0 md:left-64 right-0 z-10 p-4 border-b border-border bg-card/90 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <span className="bg-gradient-to-r from-sunset to-primary bg-clip-text text-transparent">
            Chat with Waffle
          </span>
        </h1>
        <p className="text-muted-foreground">Your climbing companion for questions and conversations</p>
      </div>

      {/* Messages - Scrollable area between fixed header and footer */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-28 pb-32">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`
              max-w-xs md:max-w-md p-4 
              ${message.isUser 
                ? 'bg-primary text-primary-foreground ml-12' 
                : 'bg-card mr-12 border-forest/20'
              }
            `}>
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-2 ${message.isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </Card>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <Card className="max-w-xs md:max-w-md p-4 bg-card mr-12 border-forest/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-forest rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-forest rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-forest rounded-full animate-pulse delay-200"></div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Fixed Input Area - positioned to account for sidebar */}
      <div className="fixed bottom-0 left-0 md:left-64 right-0 z-10 p-4 border-t border-border bg-card/90 backdrop-blur-sm">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="pr-12 min-h-[44px] resize-none bg-background border-border"
              disabled={isLoading}
            />
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="border-border hover:bg-muted/50"
            disabled={isLoading}
            title="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}