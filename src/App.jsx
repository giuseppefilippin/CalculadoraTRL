import { useState } from "react";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Resultado from "./components/Resultado";
import Header from "./components/header";

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [resultadoData, setResultadoData] = useState(null);

  const handleStart = (data) => {
    setFormData(data);
    setStep(2);
  };

  const handleResultado = (notaFinal, trls) => {
    setResultadoData({ notaFinal, trls });
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {step === 1 && <Step1 onStart={handleStart} />}
          {step === 2 && (
            <Step2
              formData={formData}
              onFinish={handleResultado}
            />
          )}
          {step === 3 && resultadoData && (
            <Resultado
              nomeResponsavel={formData.nomeResponsavel}
              nomeTecnologia={formData.nomeTecnologia}
              notaFinal={resultadoData.notaFinal}
              trls={resultadoData.trls}
              onReset={() => {
                setFormData({});
                setResultadoData(null);
                setStep(1);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;