import { useState } from "react";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import "./App.css";

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nomeTecnologia: "",
    nomeResponsavel: "",
    dataAvaliacao: "",
  });

  const handleStart = (data) => {
    setFormData(data);
    setStep(2);
  };

  return (
    <div className="app-container">
      {step === 1 && <Step1 onStart={handleStart} />}
      {step === 2 && <Step2 formData={formData} />}
    </div>
  );
}

export default App;
