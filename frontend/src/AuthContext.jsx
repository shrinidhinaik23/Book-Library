import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { setUnauthorizedHandler } from './api.js'

const AuthContext = createContext(null)

function readUser() {
  try { return JSON.parse(localStorage.getItem('blm:user')) } catch { return null }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('blm:token'))
  const [user, setUser] = useState(readUser)

  useEffect(() => {
    if (token) localStorage.setItem('blm:token', token); else localStorage.removeItem('blm:token')
  }, [token])
  useEffect(() => {
    if (user) localStorage.setItem('blm:user', JSON.stringify(user)); else localStorage.removeItem('blm:user')
  }, [user])

  const loginSession = useCallback(data => { setToken(data.token); setUser(data.user) }, [])
  const logout = useCallback(() => { setToken(null); setUser(null) }, [])

  // if the API ever says our token is invalid/expired, drop the session
  useEffect(() => { setUnauthorizedHandler(logout) }, [logout])

  return <AuthContext.Provider value={{ token, user, loginSession, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
