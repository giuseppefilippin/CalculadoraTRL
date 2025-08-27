"use client"

import { useState } from "react"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import lactecLogo from "../imgs/LACTEClogo.jpg"
import araucariaLogo from "../imgs/fundacaoARAUCARIA.png"

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "Email não encontrado. Verifique se o email está correto ou crie uma nova conta."
      case "auth/wrong-password":
        return "Senha incorreta. Tente novamente."
      case "auth/invalid-email":
        return "Email inválido. Verifique o formato do email."
      case "auth/email-already-in-use":
        return "Este email já está sendo usado. Tente fazer login ou use outro email."
      case "auth/weak-password":
        return "Senha muito fraca. Use pelo menos 6 caracteres."
      case "auth/invalid-credential":
        return "Email ou senha incorretos. Verifique suas credenciais."
      case "auth/too-many-requests":
        return "Muitas tentativas de login. Tente novamente em alguns minutos."
      default:
        return "Erro ao processar solicitação. Tente novamente."
    }
  }

  const validateForm = () => {
    if (!email.includes("@")) {
      setError("Email deve conter o símbolo @")
      return false
    }

    if (email.length < 5) {
      setError("Email deve ter pelo menos 5 caracteres")
      return false
    }

    if (password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres")
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      console.log("[v0] Attempting authentication with:", { email, isRegistering })
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      console.log("[v0] Authentication successful")
      onLoginSuccess()
    } catch (error) {
      console.log("[v0] Authentication error:", error.code, error.message)
      setError(getErrorMessage(error.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <img src={lactecLogo || "/placeholder.svg"} alt="LACTEC" className="h-12" />
              <img src={araucariaLogo || "/placeholder.svg"} alt="Araucária" className="h-12" />
            </div>
            <div className="text-center ml-33">
              <h1 className="text-2xl font-bold text-gray-900">TRL Calculator</h1>
              <p className="text-sm text-gray-600">Technology Readiness Level</p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">Avaliação de Maturidade Tecnológica</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">{isRegistering ? "Criar Conta" : "Fazer Login"}</h2>
              <p className="mt-2 text-gray-600">
                {isRegistering ? "Registre-se para acessar o sistema" : "Entre com suas credenciais"}
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer transition-colors duration-200"
                >
                  {loading ? "Processando..." : isRegistering ? "Criar Conta" : "Entrar"}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-blue-600 hover:text-blue-500 text-sm cursor-pointer transition-colors duration-200"
                >
                  {isRegistering ? "Já tem conta? Faça login" : "Não tem conta? Registre-se"}
                </button>
              </div>
            </form>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              <span className="text-blue-600 font-medium">⚡ Ferramenta LACTEC</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Login
