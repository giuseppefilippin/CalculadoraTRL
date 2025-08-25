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

  // Mapeia os códigos de erro mais comuns do Firebase para mensagens em PT-BR
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      // Login
      case "auth/invalid-credential":
      case "auth/invalid-login-credentials": // alias visto em algumas versões do SDK
      case "auth/wrong-password":
        return "Email ou senha incorretos. Verifique suas credenciais."
      case "auth/user-not-found":
        return "Email não encontrado. Verifique se o email está correto ou crie uma nova conta."
      case "auth/too-many-requests":
        return "Muitas tentativas de login. Tente novamente em alguns minutos."
      case "auth/invalid-email":
        return "Email inválido. Verifique o formato do email."

      // Cadastro
      case "auth/email-already-in-use":
        return "Este email já está sendo usado. Tente fazer login ou use outro email."
      case "auth/weak-password":
        return "Senha muito fraca. Use pelo menos 6 caracteres."
      case "auth/missing-password":
        return "Informe uma senha para continuar."
      case "auth/missing-email":
        return "Informe um email para continuar."

      // Genéricos/comuns
      case "auth/network-request-failed":
        return "Falha de rede. Verifique sua conexão com a internet."
      case "auth/internal-error":
        return "Erro interno. Tente novamente em instantes."

      default:
        return "Erro ao processar a solicitação. Tente novamente."
    }
  }

  const validateForm = () => {
    // Campos vazios (apesar do 'required', validamos para feedback imediato)
    if (!email) {
      setError("Informe um email.")
      return false
    }
    if (!password) {
      setError("Informe uma senha.")
      return false
    }

    // Regras simples de formato/tamanho
    if (!email.includes("@")) {
      setError("Email deve conter o símbolo @.")
      return false
    }

    if (email.length < 5) {
      setError("Email deve ter pelo menos 5 caracteres.")
      return false
    }

    if (password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres.")
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return // evita cliques duplos
    setError("")

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      console.log("[v1] Attempting authentication with:", { email, isRegistering })
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      console.log("[v1] Authentication successful")
      onLoginSuccess && onLoginSuccess()
    } catch (err) {
      // Log completo para depuração (códigos variam entre versões do SDK)
      console.log("[v1] Authentication error (full):", err)

      const code = err?.code || "unknown"
      const message = getErrorMessage(code)

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {isRegistering ? "Criar Conta" : "Fazer Login"}
          </h2>
          <p className="mt-2 text-gray-600">
            {isRegistering ? "Registre-se para acessar o sistema" : "Entre com suas credenciais"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
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
                autoComplete="email"
                inputMode="email"
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
                autoComplete={isRegistering ? "new-password" : "current-password"}
              />
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
            >
              {error}
            </div>
          )}

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
              onClick={() => {
                setIsRegistering(!isRegistering)
                setError("") // limpa mensagens ao alternar modo
              }}
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
