"use client"

import { useState, useEffect } from "react"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "../firebase"
import Login from "./Login"

const AuthWrapper = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Login onLoginSuccess={() => setUser(auth.currentUser)} />
  }

  return (
    <div>
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="text-sm text-gray-600">
              Logado como: <span className="font-medium">{user.email}</span>
            </div>
            <button onClick={handleLogout} className="text-sm text-indigo-600 hover:text-indigo-500">
              Sair
            </button>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}

export default AuthWrapper
