"use client"

import { useState, useEffect } from "react"
import { auth } from "../firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import lactecLogo from "../imgs/LACTEClogo.jpg"
import araucariaLogo from "../imgs/fundacaoARAUCARIA.png"

export default function Header({ currentPage, setCurrentPage }) {
  const [user, setUser] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setDropdownOpen(false)
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  const handleNavigateToResults = () => {
    setCurrentPage("historico")
    setDropdownOpen(false)
  }

  const handleNavigateToHome = () => {
    setCurrentPage("home")
    setDropdownOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-6">
            {/* LACTEC Logo */}
            <div className="flex-shrink-0">
              <img src={lactecLogo || "/placeholder.svg"} alt="LACTEC" className="h-10 w-auto" />
            </div>

            {/* Separator */}
            <div className="hidden sm:block w-px h-8 bg-gray-300"></div>

            {/* Araucária Logo */}
            <div className="flex-shrink-0">
              <img src={araucariaLogo || "/placeholder.svg"} alt="Fundação Araucária" className="h-10 w-auto" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <h1 className="text-xl font-bold text-gray-900">TRL Calculator</h1>
              <p className="text-sm text-gray-500">Technology Readiness Level</p>
            </div>

            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                Avaliação de Maturidade Tecnológica
              </span>
            </div>

            {user && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 cursor-pointer"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100 truncate">
                          {user.email}
                        </div>
                        <button
                          onClick={handleNavigateToHome}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                        >
                          Início
                        </button>
                        <button
                          onClick={handleNavigateToResults}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                        >
                          Resultados
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-150 border-t border-gray-100"
                        >
                          Sair
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
