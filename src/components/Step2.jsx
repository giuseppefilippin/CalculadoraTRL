"use client"

import { useEffect, useState } from "react"
import db from "../firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import Tooltip from "./Tooltip" // Importar o componente Tooltip

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

  // Glossário para termos dentro das perguntas
  const inQuestionGlossary = {
    "princípios teóricos e físicos":
      "Fundamentos científicos e leis da natureza que explicam o funcionamento da tecnologia.",
    "restrições legais e normativas":
      "Leis, regulamentos, padrões e normas técnicas que a tecnologia deve cumprir para ser desenvolvida, produzida ou comercializada.",
    "riscos técnicos e desafios":
      "Obstáculos ou incertezas de engenharia, design ou implementação que podem comprometer o sucesso do projeto.",
    "funções críticas":
      "As funcionalidades essenciais e indispensáveis do produto/processo, cujo mau funcionamento comprometeria a aplicação principal da tecnologia.",
    GAPs: "Lacunas ou deficiências no conhecimento, tecnologia ou recursos que precisam ser preenchidas para o avanço do projeto.",
    "ambiente relevante":
      "Um ambiente de teste que simula as condições reais de operação da tecnologia, mas em escala controlada ou com simplificações.",
    "ambiente operacional":
      "O ambiente real onde a tecnologia será utilizada, com todas as suas complexidades e interações.",
    "modelo representativo $$protótipo$$":
      "Uma versão funcional (real ou em escala) do sistema ou subsistema, construída para testes e demonstrações.",
    "documentação formal de regulamentação":
      "Documentos oficiais exigidos por órgãos reguladores para certificar a conformidade e segurança da tecnologia.",
    "gestão e controle de configuração":
      "Processos para gerenciar e rastrear mudanças no design, desenvolvimento e operação da tecnologia.",
    "produção em escala":
      "A capacidade de fabricar ou implementar a tecnologia em grandes volumes, de forma eficiente e consistente.",
    "viabilidade teórica":
      "A possibilidade de a tecnologia funcionar com base em princípios científicos e análises, antes de qualquer experimentação prática.",
    "requisitos de desempenho":
      "Critérios específicos que definem quão bem a tecnologia deve funcionar, como velocidade, precisão, capacidade, etc.",
    "requisitos de interface":
      "Especificações sobre como a tecnologia interage com outros sistemas, usuários ou o ambiente.",
    "interações entre os componentes/subsistemas":
      "Como as diferentes partes da tecnologia se comunicam e trabalham juntas.",
    "modelo final": "A versão completa e otimizada da tecnologia, pronta para implantação ou comercialização.",
    "sistema operacional": "O ambiente de uso final da tecnologia, onde ela opera em condições reais.",
    usabilidade: "A facilidade com que os usuários podem aprender a usar, operar e interagir com a tecnologia.",
    "publicações científicas e/ou patentes":
      "Registros formais do conhecimento e da propriedade intelectual da tecnologia.",
    "reproduzir o mesmo projeto":
      "A capacidade de replicar o desenvolvimento ou a aplicação da tecnologia com os mesmos resultados e requisitos.",
  }

  // Explicações para cada nível TRL
  const trlExplanations = {
    1: "Neste nível, o foco é na pesquisa fundamental. As perguntas buscam verificar se os princípios científicos básicos foram identificados e se há uma base teórica sólida para a tecnologia.",
    2: "Aqui, o conceito tecnológico começa a tomar forma. As perguntas abordam a formulação clara do conceito e a identificação das suas potenciais aplicações e funcionalidades.",
    3: "Este nível foca na prova de conceito experimental. As perguntas verificam se experimentos iniciais foram realizados para validar o conceito em laboratório e se o projeto conceitual está documentado.",
    4: "A validação de componentes em ambiente laboratorial é o objetivo. As perguntas investigam se os componentes individuais foram testados, se os GAPs tecnológicos foram identificados e se os requisitos gerais do sistema foram estabelecidos.",
    5: "Neste nível, o sistema é validado em um ambiente relevante. As perguntas abordam a definição de requisitos de desempenho em ambiente relevante, o projeto preliminar e a análise de falhas.",
    6: "A demonstração do sistema em ambiente relevante é o foco. As perguntas verificam a identificação e análise de funções críticas, a definição do ambiente relevante de funcionamento e os testes do protótipo completo.",
    7: "Este nível envolve a demonstração do protótipo em um ambiente realista. As perguntas abordam a definição do ambiente operacional, testes de interface, simulações de funcionalidades e a integração do protótipo.",
    8: "A certificação do sistema completo é o objetivo. As perguntas investigam a construção e integração do modelo final, ajustes de componentes, testes de usabilidade e documentação formal de regulamentação.",
    9: "Nível final, onde o sistema está operacional e em produção em escala. As perguntas verificam a demonstração plena em operação, a implementação do conceito operacional, processos de fabricação e publicações/patentes.",
  }

  // Função para renderizar o texto da pergunta com tooltips para termos específicos
  const renderQuestionWithTooltips = (questionText) => {
    let parts = [questionText]

    Object.entries(inQuestionGlossary).forEach(([term, definition]) => {
      const newParts = []
      const regex = new RegExp(`(${term.replace(/\\$$|\\$$/g, (match) => `\\${match}`)})`, "gi") // Escapa parênteses para regex

      parts.forEach((part, partIndex) => {
        if (typeof part === "string") {
          const split = part.split(regex)
          split.forEach((subPart, i) => {
            if (i % 2 === 1) {
              // É um termo correspondente
              newParts.push(
                <Tooltip key={`${term}-${partIndex}-${i}`} content={definition} position="top">
                  <span className="underline decoration-dotted cursor-help">{subPart}</span>
                </Tooltip>,
              )
            } else {
              newParts.push(subPart)
            }
          })
        } else {
          newParts.push(part) // Já é um elemento React (ex: outro Tooltip)
        }
      })
      parts = newParts
    })
    return parts
  }

  // Scroll para o topo quando o componente é montado
  useEffect(() => {
    window.scrollTo(0, 0)
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true)
        setError(null)

        // Carrega perguntas gerais apenas UMA VEZ
        const module = await import(`../perguntas/perguntas_gerais.json`)
        const trlData = module.default

        // Adiciona identificador de área 'gerais' a cada pergunta, pois são perguntas gerais
        const trlDataComArea = trlData.map((trl) => ({
          ...trl,
          perguntas: trl.perguntas.map((pergunta) => ({
            ...pergunta,
            area: "gerais", // Atribui 'gerais' como a área
            areaLabel: getAreaLabel("gerais"), // Atribui 'Gerais' como o rótulo
          })),
        }))

        if (trlDataComArea.length === 0) {
          throw new Error("Nenhuma pergunta foi carregada")
        }

        // Combina TRLs (isso também os ordenará)
        // Esta função é útil se houvesse múltiplos arquivos JSON de perguntas que precisassem ser mesclados.
        // Para um único arquivo, ela ainda garante a estrutura e ordenação.
        const trlsCombinados = combinarTRLs(trlDataComArea)

        // Filtra TRLs baseado no TRL inicial informado
        const trlInicial = Number.parseInt(formData.trlInicial) || 1
        const trlFinal = Number.parseInt(formData.trlFinal) || 9

        const trlsFiltrados = trlsCombinados.filter((trl) => {
          const trlNumero = Number.parseInt(trl.nivel.match(/\d+/)[0])
          return trlNumero >= trlInicial && trlNumero <= trlFinal
        })

        const initialResponses = trlsFiltrados.map((trl) =>
          trl.perguntas.map(() => ({ resposta: "", comentario: "", explicacaoResposta: "" })),
        )

        setTrls(trlsFiltrados)
        setResponses(initialResponses)
      } catch (error) {
        console.error("Erro ao carregar perguntas:", error)
        setError("Erro ao carregar as perguntas. Verifique se os arquivos existem.")
      } finally {
        setLoading(false)
      }
    }
    loadQuestions()
  }, [formData.areasSelecionadas, formData.areaSelecionada, formData.trlInicial, formData.trlFinal])

  // Função para combinar TRLs de diferentes áreas
  const combinarTRLs = (allTrlData) => {
    const trlMap = new Map()

    allTrlData.forEach((trl) => {
      const nivel = trl.nivel
      if (trlMap.has(nivel)) {
        // Combina perguntas do mesmo TRL
        const existingTrl = trlMap.get(nivel)
        existingTrl.perguntas.push(...trl.perguntas)
      } else {
        trlMap.set(nivel, { ...trl })
      }
    })

    // Converte Map para array e ordena por TRL
    return Array.from(trlMap.values()).sort((a, b) => {
      const trlA = Number.parseInt(a.nivel.match(/\d+/)[0])
      const trlB = Number.parseInt(b.nivel.match(/\d+/)[0])
      return trlA - trlB
    })
  }

  const getAreaLabel = (area) => {
    const labels = {
      eletrica: "Elétrica",
      eletronica: "Eletrônica",
      hardware: "Hardware",
      software: "Software",
      gerais: "Gerais",
    }
    return labels[area] || area
  }

  // Scroll para o topo quando muda de TRL
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentTrlIndex])

  const handleChange = (trlIdx, perguntaIdx, field, value) => {
    const updated = [...responses]
    if (!updated[trlIdx]) {
      updated[trlIdx] = []
    }
    if (!updated[trlIdx][perguntaIdx]) {
      updated[trlIdx][perguntaIdx] = { resposta: "", comentario: "", explicacaoResposta: "" }
    }
    updated[trlIdx][perguntaIdx][field] = value
    setResponses(updated)
  }

  const salvarResultadoNoFirebase = async (notaFinal) => {
    const respostasPorNivel = trls.map((trl, trlIdx) => ({
      nivel: trl.nivel,
      perguntas: trl.perguntas.map((perguntaObj, idx) => ({
        pergunta: perguntaObj.pergunta,
        explicacao: perguntaObj.explicacao || "",
        area: perguntaObj.area || "",
        areaLabel: perguntaObj.areaLabel || "",
        resposta: responses[trlIdx][idx].resposta,
        comentario: responses[trlIdx][idx].comentario,
        explicacaoResposta: responses[trlIdx][idx].explicacaoResposta || "",
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
    const threshold = 0.55 //0.55 funciona melhor com numero menor de perguntas (ex 5 perguntas)
    const trlInicial = Number.parseInt(formData.trlInicial) || 1

    // Começa com o TRL inicial como base mínima
    let notaFinal = trlInicial
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
          area: perguntaObj.area || "",
          areaLabel: perguntaObj.areaLabel || "",
          resposta: respostas[idx].resposta,
          comentario: respostas[idx].comentario,
          explicacaoResposta: respostas[idx].explicacaoResposta || "",
          peso,
        }
      })

      trlsComPesos.push({ nivel: trl.nivel, perguntas })

      const mediaPonderada = somaPontos / somaPesos
      if (mediaPonderada >= threshold) {
        // Calcula o TRL baseado no número do TRL atual, não no índice
        const trlAtualNumero = Number.parseInt(trl.nivel.match(/\d+/)[0])
        notaFinal = trlAtualNumero
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
      <div className="max-w-4xl mx-auto pt-8 pb-16">
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
      <div className="max-w-4xl mx-auto pt-8 pb-16">
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

  if (trls.length === 0) {
    return (
      <div className="max-w-4xl mx-auto pt-8 pb-16">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 text-center">
            <div className="text-yellow-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma Pergunta Encontrada</h3>
            <p className="text-gray-600 mb-4">
              Não há perguntas disponíveis para o intervalo de TRL {formData.trlInicial} a {formData.trlFinal}.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    )
  }

  const trlAtual = trls[currentTrlIndex]
  const respostasTrlAtual = responses[currentTrlIndex] || []
  const progress = ((currentTrlIndex + 1) / trls.length) * 100

  // Obter o número do TRL atual para exibição
  const trlAtualNumero = Number.parseInt(trlAtual?.nivel.match(/\d+/)[0])
  const trlInicial = Number.parseInt(formData.trlInicial) || 1
  const trlFinal = Number.parseInt(formData.trlFinal) || 9

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-16">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progresso da Avaliação</span>
          <span className="text-sm text-gray-500">
            TRL {trlAtualNumero} ({currentTrlIndex + 1} de {trls.length})
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        {/* Indicador de intervalo TRL */}
        <div className="mt-2 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            Avaliando TRL {trlInicial} até TRL {trlFinal}
          </span>
        </div>
      </div>

      {/* TRL Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-6">
          <h2 className="text-2xl font-bold text-white mb-2">{trlAtual?.nivel || "Carregando..."}</h2>
          <p className="text-green-100">Responda às perguntas abaixo para avaliar este nível de maturidade</p>
        </div>

        <div className="p-6">
          {/* Nova explicação para o TRL atual */}
          {trlAtualNumero && trlExplanations[trlAtualNumero] && (
            <p className="text-gray-700 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <span className="font-semibold text-blue-800">Sobre este TRL:</span> {trlExplanations[trlAtualNumero]}
            </p>
          )}
          <div className="space-y-6">
            {trlAtual?.perguntas?.map((perguntaObj, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">{idx + 1}</span>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {renderQuestionWithTooltips(perguntaObj.pergunta)}
                        </h3>
                        {perguntaObj.areaLabel && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {perguntaObj.areaLabel}
                          </span>
                        )}
                      </div>
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

                    {/* Campo adicional para explicação quando existe */}
                    {perguntaObj.explicacao && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Tooltip content={perguntaObj.explicacao} position="top">
                            <svg
                              className="w-4 h-4 text-blue-600 hover:text-blue-500 transition-colors cursor-help"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </Tooltip>
                          <span className="text-sm font-medium text-gray-700">Explicação:</span>
                        </div>
                        <textarea
                          rows={4}
                          value={respostasTrlAtual[idx]?.explicacaoResposta || ""}
                          onChange={(e) => handleChange(currentTrlIndex, idx, "explicacaoResposta", e.target.value)}
                          placeholder="Descreva detalhadamente sua resposta..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                        />
                      </div>
                    )}
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
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 002 2v14a2 2 0 002 2z"
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
