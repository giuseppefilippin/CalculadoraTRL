"use client"

import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js"

ChartJS.register(BarElement, CategoryScale, LinearScale)

function Resultado({ nomeResponsavel, nomeTecnologia, notaFinal, trls, onReset }) {
  const getTRLDescription = (level) => {
    const descriptions = {
      1: "Princípios básicos observados",
      2: "Conceito tecnológico formulado",
      3: "Prova de conceito experimental",
      4: "Validação em laboratório",
      5: "Validação em ambiente relevante",
      6: "Demonstração em ambiente relevante",
      7: "Demonstração em ambiente operacional",
      8: "Sistema completo e qualificado",
      9: "Sistema comprovado em ambiente operacional",
    }
    return descriptions[level] || "Nível não definido"
  }

  const getTRLColor = (level) => {
    if (level <= 3) return "bg-red-100 text-red-800 border-red-200"
    if (level <= 6) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-green-100 text-green-800 border-green-200"
  }

  const labels = trls.map((_, i) => `TRL ${i + 1}`)
  const data = trls.map((trl) => {
    let somaPesos = 0
    let somaPontos = 0

    trl.perguntas.forEach((p) => {
      somaPesos += p.peso
      if (p.resposta === "sim") somaPontos += p.peso
    })

    return somaPesos > 0 ? Math.round((somaPontos / somaPesos) * 100) / 100 : 0
  })

  const chartData = {
    labels,
    datasets: [
      {
        label: "Desempenho por TRL",
        data,
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          callback: (value) => (value * 100).toFixed(0) + "%",
        },
      },
    },
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-24">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
          <h2 className="text-2xl font-bold text-white mb-2">Resultado da Avaliação TRL</h2>
          <p className="text-blue-100">Análise completa da maturidade tecnológica do seu projeto</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Projeto</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Projeto</dt>
                  <dd className="text-sm text-gray-900">{nomeTecnologia}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Pesquisador</dt>
                  <dd className="text-sm text-gray-900">{nomeResponsavel}</dd>
                </div>
              </dl>
            </div>

            <div className="flex items-center justify-center">
              <div className="text-center">
                <div
                  className={`inline-flex items-center px-6 py-3 rounded-full border-2 ${getTRLColor(notaFinal)} mb-4`}
                >
                  <span className="text-3xl font-bold mr-2">TRL {notaFinal}</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Nível de Maturidade Alcançado</h4>
                <p className="text-sm text-gray-600">{getTRLDescription(notaFinal)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Desempenho por Nível TRL</h3>
          <p className="text-sm text-gray-600">Pontuação obtida em cada nível de maturidade tecnológica</p>
        </div>

        <div className="p-6">
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detalhamento das Respostas</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {trls.map((trl, trlIdx) => (
            <div key={trlIdx} className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4">{trl.nivel}</h4>
              <div className="space-y-3">
                {trl.perguntas.map((pergunta, perguntaIdx) => (
                  <div key={perguntaIdx} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">{pergunta.pergunta}</p>
                        {pergunta.comentario && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Comentário:</span> {pergunta.comentario}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          <span className="font-medium">Peso:</span> {pergunta.peso}
                        </p>
                      </div>
                      <span
                        className={`ml-4 px-2 py-1 text-xs font-medium rounded-full ${
                          pergunta.resposta === "sim" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {pergunta.resposta === "sim" ? "Sim" : "Não"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Nova Avaliação
        </button>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Exportar Relatório
        </button>
      </div>
    </div>
  )
}

export default Resultado
