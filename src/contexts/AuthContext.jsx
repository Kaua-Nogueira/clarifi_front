import { createContext, useContext, useMemo, useState } from 'react'
import { adminApi, api } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem('clarifi_session')) } catch { return null }
  })
  const [adminSession, setAdminSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem('clarifi_admin_session')) } catch { return null }
  })
  const value = useMemo(() => ({
    user: session?.user,
    isAuthenticated: Boolean(session?.token),
    login: async (credentials) => {
      const data = await api.login(credentials)
      localStorage.setItem('clarifi_session', JSON.stringify(data))
      setSession(data)
    },
    logout: () => {
      localStorage.removeItem('clarifi_session')
      setSession(null)
    },
    adminUser: adminSession?.user,
    isAdminAuthenticated: Boolean(adminSession?.token),
    adminLogin: async (credentials) => {
      const data = await adminApi.login(credentials)
      localStorage.setItem('clarifi_admin_session', JSON.stringify(data))
      setAdminSession(data)
    },
    adminLogout: () => {
      localStorage.removeItem('clarifi_admin_session')
      setAdminSession(null)
    },
  }), [session, adminSession])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
