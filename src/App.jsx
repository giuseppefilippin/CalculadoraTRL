"use client"

import { useState } from "react"
import Header from "./components/Header"
import LandingPage from "./components/landing-page"
import Step1 from "./components/Step1"
import Step2 from "./components/Step2"
import Resultado from "./components/Resultado"

function App() {
  const [currentStep, setCurrentStep] = useState(0) // 0 = Landing, 1 = Step1, 2 = Step2, 3 = Resultado
  const [formData, setFormData] = useState({})
  const [resultData, setResultData] = useState(null)

  const handleLandingStart = () => {
    setCurrentStep(1)
  } 

  const handleStep1Complete = (data) => {
    setFormData(data)
    setCurrentStep(2)
  }

  const handleStep2Complete = (notaFinal, trls) => {
    setResultData({ notaFinal, trls })
    setCurrentStep(3)
  }

  const handleReset = () => {
    setCurrentStep(0)
    setFormData({})
    setResultData(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24">
        {currentStep === 0 && <LandingPage onStart={handleLandingStart} />}

        {currentStep === 1 && <Step1 onStart={handleStep1Complete} />}

        {currentStep === 2 && <Step2 formData={formData} onFinish={handleStep2Complete} />}

        {currentStep === 3 && resultData && (
          <Resultado
            formData={formData}
            notaFinal={resultData.notaFinal}
            trls={resultData.trls}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  )
}

export default App
