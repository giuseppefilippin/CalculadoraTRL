import lactecLogo from "../imgs/LACTEClogo.jpg";
import araucariaLogo from "../imgs/fundacaoARAUCARIA.png";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-6">
            {/* LACTEC Logo */}
            <div className="flex-shrink-0">
              <img
                src={lactecLogo || "/placeholder.svg"}
                alt="LACTEC"
                className="h-10 w-auto"
              />
            </div>

            {/* Separator */}
            <div className="hidden sm:block w-px h-8 bg-gray-300"></div>

            {/* Araucária Logo */}
            <div className="flex-shrink-0">
              <img
                src={araucariaLogo || "/placeholder.svg"}
                alt="Fundação Araucária"
                className="h-10 w-auto"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <h1 className="text-xl font-bold text-gray-900">
                TRL Calculator
              </h1>
              <p className="text-sm text-gray-500">
                Technology Readiness Level
              </p>
            </div>

            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                Avaliação de Maturidade Tecnológica
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
