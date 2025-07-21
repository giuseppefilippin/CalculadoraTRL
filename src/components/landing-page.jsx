"use client"

export default function LandingPage({ onStart }) {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <main className="pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Calculadora de Maturidade Tecnológica</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Avalie o nível de desenvolvimento e prontidão de suas tecnologias usando a metodologia TRL (Technology
              Readiness Level) de forma profissional e padronizada.
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Ferramenta Oficial LACTEC
            </div>
          </div>

          {/* What is TRL Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">O que é TRL?</h2>
              <p className="text-blue-100">Technology Readiness Level - Nível de Prontidão Tecnológica</p>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                O TRL é uma metodologia sistemática usada para avaliar o nível de maturidade de uma tecnologia
                específica. Desenvolvida pela NASA, esta escala de 1 a 9 níveis permite uma avaliação objetiva do
                desenvolvimento tecnológico, desde a pesquisa básica até a implementação operacional completa.
              </p>
              <p className="text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
              </p>
            </div>
          </div>

          {/* TRL Levels Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Níveis de Maturidade TRL</h2>
              <p className="text-green-100">Entenda cada nível da escala de prontidão tecnológica</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pesquisa Básica */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-600 font-bold text-lg">1-3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Pesquisa Básica</h3>
                  <p className="text-sm text-gray-600">
                    Princípios básicos observados, conceito tecnológico formulado e prova de conceito experimental.
                  </p>
                </div>

                {/* Desenvolvimento */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-yellow-600 font-bold text-lg">4-6</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Desenvolvimento</h3>
                  <p className="text-sm text-gray-600">
                    Validação em laboratório, ambiente relevante e demonstração em ambiente operacional.
                  </p>
                </div>

                {/* Implementação */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 font-bold text-lg">7-9</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Implementação</h3>
                  <p className="text-sm text-gray-600">
                    Demonstração operacional, sistema qualificado e comprovado em ambiente real.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Como Funciona</h2>
              <p className="text-purple-100">Processo simples e estruturado de avaliação</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Informações Básicas</h4>
                  <p className="text-sm text-gray-600">Preencha dados do projeto e selecione as áreas de avaliação</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Questionário</h4>
                  <p className="text-sm text-gray-600">Responda perguntas específicas para cada nível TRL</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Análise</h4>
                  <p className="text-sm text-gray-600">Sistema calcula automaticamente o nível TRL alcançado</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">4</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Relatório</h4>
                  <p className="text-sm text-gray-600">Receba relatório detalhado com resultados e recomendações</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-12">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Características da Ferramenta</h2>
              <p className="text-indigo-100">Recursos avançados para avaliação profissional</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Múltiplas Áreas</h4>
                    <p className="text-sm text-gray-600">Avaliação em diferentes domínios tecnológicos</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Cálculo Automático</h4>
                    <p className="text-sm text-gray-600">Algoritmo inteligente com pesos diferenciados</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Relatórios Detalhados</h4>
                    <p className="text-sm text-gray-600">Exportação e visualização completa dos resultados</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Interface Intuitiva</h4>
                    <p className="text-sm text-gray-600">Design moderno e fácil navegação</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Armazenamento Seguro</h4>
                    <p className="text-sm text-gray-600">Dados salvos com segurança na nuvem</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Metodologia Validada</h4>
                    <p className="text-sm text-gray-600">Baseado em padrões internacionais reconhecidos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Pronto para Avaliar sua Tecnologia?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Inicie agora a avaliação TRL do seu projeto e obtenha insights valiosos sobre o nível de maturidade da
                sua tecnologia. O processo é rápido, intuitivo e baseado em metodologias reconhecidas
                internacionalmente.
              </p>
              <button
                onClick={onStart}
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-colors shadow-lg"
              >
                <svg className="mr-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Começar Avaliação TRL
                <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
