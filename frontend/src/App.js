import { useState } from "react";
import Header from "./components/Header";
import StepOne from "./components/StepOne";
import StepTwo from "./components/StepTwo";
import "./App.css";

function App() {
  const [started, setStarted] = useState(false);

  return (
    <div>
      <Header />
      <main>{started ? <StepTwo /> : <StepOne onStart={() => setStarted(true)} />}</main>
    </div>
  );
}

export default App;
