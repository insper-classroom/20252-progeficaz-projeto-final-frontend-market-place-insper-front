/**
 * Authentication Context
 * Manages user authentication state and provides auth methods
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authService } from '../services'
import type { User, LoginRequest, RegisterRequest } from '../types'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterRequest) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        await refreshUser()
      } else {
        setIsLoading(false)
      }
    }
    initAuth()
  }, [])

  const refreshUser = async () => {
    try {
      setIsLoading(true)
      const response = await authService.getCurrentUser()
      if (response.success) {
        setUser(response.data)
      } else {
        // Token inválido, limpar
        authService.logout()
        setUser(null)
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
      authService.logout()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials)
      if (response.success) {
        // Token já foi salvo pelo authService
        await refreshUser()
        return { success: true }
      }
      return { success: false, error: response.detail }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao fazer login',
      }
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data)
      if (response.success) {
        return { success: true }
      }
      return { success: false, error: response.detail }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao registrar',
      }
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to access auth context
 * Must be used within AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
