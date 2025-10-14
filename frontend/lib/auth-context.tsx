"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api, type User } from "./api"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullname?: string, title?: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      // HTTP-only cookie kullandığımız için direkt getMe API'sini çağır
      const userData = await api.getMe()
      setUser(userData)
    } catch (error) {
      // Eğer getMe başarısız olursa kullanıcı giriş yapmamış demektir
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function login(email: string, password: string) {
    const loginResponse = await api.login(email, password)
    // Login başarılı olduktan sonra kullanıcı bilgilerini al
    const userData = await api.getMe()
    setUser(userData)
    router.push("/dashboard")
  }

  async function register(email: string, password: string, fullname?: string, title?: string) {
    await api.register(email, password, fullname, title)
    // Register başarılı olduktan sonra kullanıcı bilgilerini al
    const userData = await api.getMe()
    setUser(userData)
    router.push("/dashboard")
  }

  async function logout() {
    await api.logout()
    setUser(null)
    router.push("/login")
  }

  async function refreshUser() {
    try {
      const userData = await api.getMe()
      setUser(userData)
    } catch (error) {
      console.error("Failed to refresh user:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
