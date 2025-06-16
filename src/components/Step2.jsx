"use client"

import { useEffect, useState } from "react"
import db from "../firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

function getPesosPergunta(nivel, perguntaTexto) {
  const pesosPorNivel = {
    "TRL 1": 1.5,
    "TRL 2": 1.6,
    "TRL 3": 1.7,
    "TRL 4": 1.8,
    "TRL 5": 1.9,
    "TRL 6": 2.0,
    "TRL 7": 2.1,
    "TRL 8": 2.2,
    "TRL 9": 2.3,
  }

  const trlNum = nivel.split(":")[0].trim()
  const pesoBase = pesosPorNivel[trlNum] || 1.0

  let pesoAjustado = pesoBase

  const palavrasChave = {
    alto: [
      "crítico",
      "crítica",
      "essencial",
      "fundamental",
      "segurança",
      "legal",
      "regulamentação",
      "LGPD",
      "produção",
    ],
    medio: [
      "teste",
      "testes",
      "testados",
      "validação",
      "documentação",
      "documentado",
      "requisito",
      "funcionalidade",
      "desempenho",
    ],
    baixo: ["identificado", "levantado", "definido", "iniciado"],
  }

  if (palavrasChave.alto.some((p) => perguntaTexto.toLowerCase().includes(p))) pesoAjustado *= 1.3
  else if (palavrasChave.medio.some((p) => perguntaTexto.toLowerCase().includes(p))) pesoAjustado *= 1.1
  else if (palavrasChave.baixo.some((p) => perguntaTexto.toLowerCase().includes(p))) pesoAjustado *= 0.9

  return Math.round(pesoAjustado * 100) / 100
}

function Step2({ formData, onFinish }) {
  const [trls, setTrls] = useState([])
  const [currentTrlIndex, setCurrentTrlIndex] = useState(0)
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true)
        setError(null)

        const module = await import(`../perguntas/perguntas_${formData.areaSelecionada}.json`)
        const trlData = module.default
        const initialResponses = trlData.map((trl) => trl.perguntas.map(() => ({ resposta: "", comentario: "" })))
        setTrls(trlData)
        setResponses(initialResponses)
      } catch (error) {
        console.error("Erro ao carregar perguntas:", error)
        setError("Erro ao carregar as perguntas. Verifique se o arquivo existe.")
      } finally {
        setLoading(false)
      }
    }
    loadQuestions()
  }, [formData.areaSelecionada])

  // Scroll to top when TRL changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentTrlIndex])

  const handleChange = (trlIdx, perguntaIdx, field, value) => {
    const updated = [...responses]
    updated[trlIdx][perguntaIdx][field] = value
    setResponses(updated)
  }

  const salvarResultadoNoFirebase = async (notaFinal) => {
    const respostasPorNivel = trls.map((trl, trlIdx) => ({
      nivel: trl.nivel,
      perguntas: trl.perguntas.map((perguntaObj, idx) => ({
        pergunta: perguntaObj.pergunta,
        explicacao: perguntaObj.explicacao || "",
        resposta: responses[trlIdx][idx].resposta,
        comentario: responses[trlIdx][idx].comentario,
        peso: getPesosPergunta(trl.nivel, perguntaObj.pergunta),
      })),
    }))

    const doc = {
      ...formData,
      notaFinal,
      respostasPorNivel,
      timestamp: serverTimestamp(),
    }

    try {
      await addDoc(collection(db, "avaliacoes_trl"), doc)
      alert("Dados salvos com sucesso no Firebase!")
    } catch (error) {
      console.error("Erro ao salvar no Firebase:", error)
      alert("Erro ao salvar no Firebase.")
    }
  }

  const calcularNotaFinal = () => {
    const threshold = 0.8
    let notaFinal = 0
    const trlsComPesos = []

    for (let i = 0; i < trls.length; i++) {
      const trl = trls[i]
      const respostas = responses[i]
      let somaPesos = 0
      let somaPontos = 0

      const perguntas = trl.perguntas.map((perguntaObj, idx) => {
        const peso = getPesosPergunta(trl.nivel, perguntaObj.pergunta)
        somaPesos += peso
        if (respostas[idx].resposta === "sim") somaPontos += peso

        return {
          pergunta: perguntaObj.pergunta,
          explicacao: perguntaObj.explicacao || "",
          resposta: respostas[idx].resposta,
          comentario: respostas[idx].comentario,
          peso,
        }
      })

      trlsComPesos.push({ nivel: trl.nivel, perguntas })

      const mediaPonderada = somaPontos / somaPesos
      if (mediaPonderada >= threshold) {
        notaFinal = i + 1
      } else {
        break
      }
    }

    salvarResultadoNoFirebase(notaFinal)

    if (typeof onFinish === "function") {
      onFinish(notaFinal, trlsComPesos)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando perguntas...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao Carregar Perguntas</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  const trlAtual = trls[currentTrlIndex]
  const respostasTrlAtual = responses[currentTrlIndex] || []
  const progress = ((currentTrlIndex + 1) / trls.length) * 100

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progresso da Avaliação</span>
          <span className="text-sm text-gray-500">
            {currentTrlIndex + 1} de {trls.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* TRL Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-6">
          <h2 className="text-2xl font-bold text-white mb-2">{trlAtual?.nivel || "Carregando..."}</h2>
          <p className="text-green-100">Responda às perguntas abaixo para avaliar este nível de maturidade</p>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {trlAtual?.perguntas?.map((perguntaObj, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">{idx + 1}</span>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{perguntaObj.pergunta}</h3>
                      {perguntaObj.explicacao && <p className="text-sm text-gray-600">{perguntaObj.explicacao}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Resposta *</label>
                        <select
                          value={respostasTrlAtual[idx]?.resposta || ""}
                          onChange={(e) => handleChange(currentTrlIndex, idx, "resposta", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          <option value="">-- Selecione --</option>
                          <option value="sim">Sim</option>
                          <option value="nao">Não</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Comentário</label>
                        <input
                          type="text"
                          value={respostasTrlAtual[idx]?.comentario || ""}
                          onChange={(e) => handleChange(currentTrlIndex, idx, "comentario", e.target.value)}
                          placeholder="Adicione observações (opcional)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <button
              disabled={currentTrlIndex === 0}
              onClick={() => setCurrentTrlIndex((i) => i - 1)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>

            {currentTrlIndex < trls.length - 1 ? (
              <button
                onClick={() => setCurrentTrlIndex((i) => i + 1)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Próximo
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={calcularNotaFinal}
                className="inline-flex items-center px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Calcular TRL
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step2
