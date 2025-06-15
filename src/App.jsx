import { useState } from "react";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Resultado from "./components/Resultado";
import "./App.css";

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
    <div className="app-container">
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
  );
}

export default App;
