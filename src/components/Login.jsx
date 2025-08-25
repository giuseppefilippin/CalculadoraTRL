"use client"

import { useState } from "react"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">{isRegistering ? "Criar Conta" : "Fazer Login"}</h2>
          <p className="mt-2 text-gray-600">
            {isRegistering ? "Registre-se para acessar o sistema" : "Entre com suas credenciais"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Processando..." : isRegistering ? "Criar Conta" : "Entrar"}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-indigo-600 hover:text-indigo-500 text-sm cursor-pointer"
            >
              {isRegistering ? "Já tem conta? Faça login" : "Não tem conta? Registre-se"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
