"use client"

import { useState, useEffect, useRef } from "react"
import { db, auth } from "../firebase"
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"

export default function HistoricoResultados({ setCurrentPage }) {
  const [resultados, setResultados] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [expandedDiagnostic, setExpandedDiagnostic] = useState(null)
  const snapRef = useRef(null)
  const authRef = useRef(null)

  useEffect(() => {
    const attachSnapshot = (uid) => {
      // limpa listener anterior se existir
      if (snapRef.current) {
        snapRef.current()
        snapRef.current = null
      }

      setLoading(true)

      const q = query(collection(db, "avaliacoes_trl"), where("userId", "==", uid), orderBy("dataAvaliacao", "desc"))

      snapRef.current = onSnapshot(
        q,
        (snap) => {
          const itens = snap.docs.map((d) => {
            const data = d.data()
            return {
              id: d.id,
              nomeProjeto: data.nomeTecnologia || "Projeto sem nome",
              descricaoProjeto: data.produto || "Sem descrição",
              status: data.status || "Não informado",
              area: Array.isArray(data.areasSelecionadas) ? data.areasSelecionadas.join(", ") : data.area || "Gerais",
              trlDesejado: Number.isFinite(Number(data.trlFinal))
                ? Number(data.trlFinal)
                : Number.isFinite(Number(data.trlDesejado))
                  ? Number(data.trlDesejado)
                  : 9,
              trlFinal: Number.isFinite(Number(data.notaFinal))
                ? Number(data.notaFinal)
                : Number.isFinite(Number(data.trlFinal))
                  ? Number(data.trlFinal)
                  : 1,
              dataAvaliacao: data.dataAvaliacao || data.timestamp,
            }
          })
          setResultados(itens)
          setLoading(false)
          setRefreshing(false)
        },
        (err) => {
          if (err?.code === "failed-precondition") {
            // fallback sem orderBy (enquanto índice não existe/offline)
            if (snapRef.current) {
              snapRef.current()
              snapRef.current = null
            }
            const qFallback = query(collection(db, "avaliacoes_trl"), where("userId", "==", uid))
            snapRef.current = onSnapshot(
              qFallback,
              (snap2) => {
                const itens = snap2.docs
                  .map((d) => ({ id: d.id, ...d.data() }))
                  .sort((a, b) => {
                    const ta = (a.dataAvaliacao?.toDate?.() || new Date(0)).getTime()
                    const tb = (b.dataAvaliacao?.toDate?.() || new Date(0)).getTime()
                    return tb - ta
                  })
                  .map((data) => ({
                    id: data.id,
                    nomeProjeto: data.nomeTecnologia || "Projeto sem nome",
                    descricaoProjeto: data.produto || "Sem descrição",
                    status: data.status || "Não informado",
                    area: Array.isArray(data.areasSelecionadas)
                      ? data.areasSelecionadas.join(", ")
                      : data.area || "Gerais",
                    trlDesejado: Number.isFinite(Number(data.trlFinal))
                      ? Number(data.trlFinal)
                      : Number.isFinite(Number(data.trlDesejado))
                        ? Number(data.trlDesejado)
                        : 9,
                    trlFinal: Number.isFinite(Number(data.notaFinal))
                      ? Number(data.notaFinal)
                      : Number.isFinite(Number(data.trlFinal))
                        ? Number(data.trlFinal)
                        : 1,
                    dataAvaliacao: data.dataAvaliacao || data.timestamp,
                  }))
                setResultados(itens)
                setLoading(false)
                setRefreshing(false)
              },
              (err2) => {
                console.error("Erro no fallback do histórico:", err2)
                setLoading(false)
                setRefreshing(false)
              },
            )
          } else {
            console.error("Erro ao ler histórico:", err)
            setLoading(false)
            setRefreshing(false)
          }
        },
      )
    }

    // conecta imediatamente se já houver usuário persistido
    if (auth.currentUser) {
      setUser(auth.currentUser)
      attachSnapshot(auth.currentUser.uid)
    } else {
      setLoading(true)
    }

    // observa mudanças de autenticação
    authRef.current = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)

      if (!currentUser) {
        if (snapRef.current) {
          snapRef.current()
          snapRef.current = null
        }
        setResultados([])
        setLoading(false)
        setRefreshing(false)
        return
      }

      attachSnapshot(currentUser.uid)
    })

    return () => {
      if (snapRef.current) snapRef.current()
      if (authRef.current) authRef.current()
    }
  }, [])

  const handleRefresh = () => {
    if (user) {
      setRefreshing(true)
    }
  }

  const toggleDiagnostic = (resultadoId) => {
    setExpandedDiagnostic(expandedDiagnostic === resultadoId ? null : resultadoId)
  }

  const renderDiagnosticDetails = (resultado) => {
    const trlLevels = [
      { level: 1, name: "Princípios básicos observados" },
      { level: 2, name: "Conceito da tecnologia formulado" },
      { level: 3, name: "Prova de conceito experimental" },
      { level: 4, name: "Tecnologia validada em laboratório" },
      { level: 5, name: "Tecnologia validada em ambiente relevante" },
      { level: 6, name: "Tecnologia demonstrada em ambiente relevante" },
      { level: 7, name: "Demonstração do sistema no ambiente operacional" },
      { level: 8, name: "Sistema completo e qualificado" },
      { level: 9, name: "Sistema operacional comprovado" },
    ]

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
        <h4 className="font-semibold text-gray-900 mb-3">Diagnóstico Detalhado</h4>
        <div className="space-y-2">
          {trlLevels.map((trl) => (
            <div key={trl.level} className="flex items-center space-x-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  trl.level <= resultado.trlFinal ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                }`}
              >
                {trl.level}
              </div>
              <div className={`flex-1 ${trl.level <= resultado.trlFinal ? "text-gray-900" : "text-gray-500"}`}>
                <span className="font-medium">TRL {trl.level}:</span> {trl.name}
              </div>
              {trl.level <= resultado.trlFinal && (
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
          <p className="text-sm text-blue-800">
            <strong>Resultado:</strong> Sua tecnologia atingiu o TRL {resultado.trlFinal} de {resultado.trlDesejado}{" "}
            desejado.
            {resultado.trlFinal < resultado.trlDesejado && (
              <span className="block mt-1">
                Para atingir o TRL {resultado.trlDesejado}, você precisa avançar{" "}
                {resultado.trlDesejado - resultado.trlFinal} nível(is).
              </span>
            )}
          </p>
        </div>
      </div>
    )
  }

  const formatarData = (timestamp) => {
    if (!timestamp) return "Data não disponível"
    const data = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando resultados...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage("home")}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao início
          </button>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          >
            <svg
              className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {refreshing ? "Recarregando..." : "Recarregar"}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Histórico de Resultados</h1>

          {resultados.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum resultado encontrado</h3>
              <p className="text-gray-500">Você ainda não realizou nenhuma avaliação TRL.</p>
              <button
                onClick={() => setCurrentPage("home")}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer"
              >
                Fazer primeira avaliação
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {resultados.map((resultado) => (
                <div key={resultado.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{resultado.nomeProjeto}</h3>
                      <p className="text-sm text-gray-600">{resultado.descricaoProjeto}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{formatarData(resultado.dataAvaliacao)}</div>
                      <div className="text-lg font-bold text-blue-600">TRL {resultado.trlFinal}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <div className="font-medium">{resultado.status}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Área:</span>
                      <div className="font-medium">{resultado.area}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">TRL Desejado:</span>
                      <div className="font-medium">TRL {resultado.trlDesejado}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Resultado:</span>
                      {resultado.trlFinal >= resultado.trlDesejado ? (
                        <div className="font-medium text-green-600">Atingido</div>
                      ) : (
                        <button
                          onClick={() => toggleDiagnostic(resultado.id)}
                          className="inline-flex items-center px-3 py-1 text-sm font-medium text-orange-700 bg-orange-100 rounded-full hover:bg-orange-200 cursor-pointer transition-colors"
                        >
                          <svg className="w-4 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                          Diagnóstico
                        </button>
                      )}
                    </div>
                  </div>

                  {expandedDiagnostic === resultado.id && renderDiagnosticDetails(resultado)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
