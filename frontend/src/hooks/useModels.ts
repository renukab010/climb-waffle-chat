import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'

const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:8000'

export interface ModelInfo {
  id: string
  name: string
  description: string
}

export interface ProviderConfig {
  id: string
  name: string
  description: string
  models: ModelInfo[]
  api_key_required: boolean
}

export interface UserSettings {
  current_provider?: string
  current_model?: string
  provider_api_keys: Record<string, boolean> // provider -> has_api_key mapping
}

export interface UserSettingsRequest {
  provider: string
  model: string
  api_key?: string // Optional for when just changing model
}

export interface ProviderApiKeyRequest {
  provider: string
  api_key: string
}

// Hook to get all providers
export const useProviders = () => {
  return useQuery<ProviderConfig[]>({
    queryKey: ['providers'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/models/providers`)
      if (!response.ok) {
        throw new Error('Failed to fetch providers')
      }
      return response.json()
    }
  })
}

// Hook to get user settings
export const useUserSettings = () => {
  const { currentUser } = useAuth()
  
  return useQuery<UserSettings>({
    queryKey: ['userSettings', currentUser?.uid],
    queryFn: async () => {
      if (!currentUser) throw new Error('No user logged in')
      
      const token = await currentUser.getIdToken()
      const response = await fetch(`${API_BASE_URL}/protected/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch user settings')
      }
      return response.json()
    },
    enabled: !!currentUser
  })
}

// Hook to save user settings
export const useSaveUserSettings = () => {
  const { currentUser } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (settings: UserSettingsRequest) => {
      if (!currentUser) throw new Error('No user logged in')
      
      const token = await currentUser.getIdToken()
      const response = await fetch(`${API_BASE_URL}/protected/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      })
      
      if (!response.ok) {
        throw new Error('Failed to save settings')
      }
      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch user settings
      queryClient.invalidateQueries({ queryKey: ['userSettings', currentUser?.uid] })
    }
  })
}
