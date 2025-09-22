"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import AuthWrapper from "./components/AuthWrapper";
import Header from "./components/Header";
import LandingPage from "./components/landing-page";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Resultado from "./components/Resultado";
import HistoricoResultados from "./components/HistoricoResultados";

function App() {
  const [currentPage, setCurrentPage] = useState("home"); // 'home' or 'historico'
  const [currentStep, setCurrentStep] = useState(0); // 0 = Landing, 1 = Step1, 2 = Step2, 3 = Resultado
  const [formData, setFormData] = useState({});
  const [resultData, setResultData] = useState(null);
  const [dadosPreenchidos, setDadosPreenchidos] = useState(null);

  // Scroll para o topo sempre que mudar de step
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep, currentPage]);
  // ✅ Sempre que autenticação mudar (login/logout), volta para a landing
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, () => {
      setCurrentPage("home");
      setCurrentStep(0);
    });
    return () => unsub();
  }, []);
  const handleLandingStart = () => {
    setCurrentStep(1);
  };

  const handleStep1Complete = (data) => {
    setFormData(data);
    setCurrentStep(2);
  };

  const handleStep2Complete = (notaFinal, trls) => {
    setResultData({ notaFinal, trls });
    setCurrentStep(3);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setFormData({});
    setResultData(null);
  };

  const handleNavigateToHome = () => {
    setCurrentPage("home");
    setCurrentStep(0);
    setFormData({});
    setResultData(null);
  };

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-50">
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

        <main className="pt-24">
          {currentPage === "historico" && (
            <HistoricoResultados 
              setCurrentPage={setCurrentPage}
              setCurrentStep={setCurrentStep}
              setDadosPreenchidos={setDadosPreenchidos} />
          )}

          {currentPage === "home" && (
            <>
              {currentStep === 0 && (
                <LandingPage onStart={handleLandingStart} />
              )}

              {currentStep === 1 && (
                 <Step1 onStart={handleStep1Complete} initialData={dadosPreenchidos}/>)}

              {currentStep === 2 && (
                <Step2 formData={formData} onFinish={handleStep2Complete} />
              )}

              {currentStep === 3 && resultData && (
                <Resultado
                  formData={formData}
                  notaFinal={resultData.notaFinal}
                  trls={resultData.trls}
                  onReset={handleReset}
                />
              )}
            </>
          )}
        </main>
      </div>
    </AuthWrapper>
  );
}

export default App;
