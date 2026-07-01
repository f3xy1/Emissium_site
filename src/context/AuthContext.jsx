import React, { createContext, useContext, useState, useEffect } from 'react'
import { getToken, removeToken, apiGetMe } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // При загрузке приложения проверяем токен
  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }

    apiGetMe()
      .then(data => setUser(data.user))
      .catch(() => removeToken())
      .finally(() => setLoading(false))
  }, [])

  const logout = () => {
    removeToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}