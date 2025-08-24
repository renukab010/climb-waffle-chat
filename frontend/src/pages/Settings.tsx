import { Monitor, Moon, Sun, Laptop, Key, Save, Eye, EyeOff } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTheme } from "next-themes"
import { useProviders, useUserSettings, useSaveUserSettings } from "@/hooks/useModels"
import { useState, useEffect } from "react"
import { toast } from "sonner"

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const { data: providers, isLoading: providersLoading } = useProviders()
  const { data: userSettings, isLoading: settingsLoading } = useUserSettings()
  const saveSettings = useSaveUserSettings()
  
  const [selectedProvider, setSelectedProvider] = useState<string>("")
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [apiKey, setApiKey] = useState<string>("")
  const [showApiKey, setShowApiKey] = useState<boolean>(false)
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)
  
  // Load user settings when available
  useEffect(() => {
    if (userSettings && isInitialLoad) {
      setSelectedProvider(userSettings.current_provider || "")
      setSelectedModel(userSettings.current_model || "")
      
      // If provider is selected and has API key, show masked key
      if (userSettings.current_provider && userSettings.provider_api_keys[userSettings.current_provider]) {
        setApiKey("••••••••••••••••")
      } else {
        setApiKey("")
      }
      setIsInitialLoad(false)
    }
  }, [userSettings, isInitialLoad])
  
  // Handle provider change
  const handleProviderChange = (newProvider: string) => {
    setSelectedProvider(newProvider)
    setSelectedModel("") // Reset model when provider changes
    
    // Check if this provider has an existing API key
    if (userSettings?.provider_api_keys[newProvider]) {
      setApiKey("••••••••••••••••") // Show masked key
    } else {
      setApiKey("") // Clear API key field
    }
  }
  
  // Handle save settings
  const handleSaveSettings = async () => {
    if (!selectedProvider) {
      toast.error("Please select a provider")
      return
    }
    
    if (!selectedModel) {
      toast.error("Please select a model")
      return
    }
    
    if (!apiKey) {
      toast.error("Please enter an API key")
      return
    }
    
    // If API key is masked and unchanged, don't send it
    const apiKeyToSend = apiKey === "••••••••••••••••" ? undefined : apiKey
    
    try {
      await saveSettings.mutateAsync({
        provider: selectedProvider,
        model: selectedModel,
        api_key: apiKeyToSend
      })
      toast.success("Settings saved successfully!")
      
      // Update the masked key display if a new key was provided
      if (apiKeyToSend) {
        setApiKey("••••••••••••••••")
      }
    } catch (error) {
      toast.error("Failed to save settings. Please try again.")
    }
  }
  
  const selectedProviderData = providers?.find(p => p.id === selectedProvider)
  const hasChanges = selectedProvider || selectedModel || apiKey
  
  return (
    <div className="flex flex-col h-full p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Customize your Climbing Waffle experience</p>
      </div>

      {/* Settings Content */}
      <div className="max-w-2xl mx-auto w-full">
        <div className="space-y-6">
          {/* Appearance Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Appearance</h2>
            <Card className="p-6">
              <div className="space-y-6">
                {/* Mode Selection */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-base">Mode</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">
                          <div className="flex items-center gap-2">
                            <Laptop className="h-4 w-4" />
                            <span>System</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            <span>Light</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            <span>Dark</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* AI Model Configuration */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium mb-4">AI Model Configuration</h3>
                    
                    {/* Step 1: Provider Selection */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm font-medium">Provider</Label>
                        <Select 
                          value={selectedProvider} 
                          onValueChange={handleProviderChange}
                          disabled={providersLoading}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={providersLoading ? "Loading..." : "Select provider"} />
                          </SelectTrigger>
                          <SelectContent>
                            {providers?.map((provider) => (
                              <SelectItem key={provider.id} value={provider.id}>
                                <div className="flex items-center gap-2">
                                  <span>{provider.name}</span>
                                  {userSettings?.provider_api_keys[provider.id] && (
                                    <span className="text-xs text-green-600">✓</span>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {selectedProviderData && (
                        <p className="text-sm text-muted-foreground">
                          {selectedProviderData.description}
                        </p>
                      )}
                    </div>

                    {/* Step 2: API Key Input (appears after provider selection) */}
                    {selectedProvider && (
                      <div className="space-y-4 mt-6">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          API Key
                          {userSettings?.provider_api_keys[selectedProvider] && (
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Saved</span>
                          )}
                        </Label>
                        <div className="relative">
                          <Input
                            type={showApiKey ? "text" : "password"}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder={userSettings?.provider_api_keys[selectedProvider] 
                              ? "API key is set (enter new key to update)" 
                              : "Enter your API key"
                            }
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            {showApiKey ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Your API key is encrypted and stored securely. We never share or expose your keys.
                        </p>
                      </div>
                    )}

                    {/* Step 3: Model Selection (appears after API key) */}
                    {selectedProvider && apiKey && selectedProviderData && (
                      <div className="space-y-4 mt-6">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-medium">Model</Label>
                          <Select 
                            value={selectedModel} 
                            onValueChange={setSelectedModel}
                          >
                            <SelectTrigger className="w-[220px]">
                              <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedProviderData.models.map((model) => (
                                <SelectItem key={model.id} value={model.id}>
                                  <div className="flex flex-col">
                                    <span>{model.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {selectedModel && (
                          <p className="text-sm text-muted-foreground">
                            {selectedProviderData.models.find(m => m.id === selectedModel)?.description}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Step 4: Save Button (appears when all fields are filled) */}
                    {selectedProvider && apiKey && selectedModel && (
                      <div className="mt-6">
                        <Button 
                          onClick={handleSaveSettings}
                          disabled={saveSettings.isPending}
                          className="w-full"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {saveSettings.isPending ? "Saving..." : "Set Configuration"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}