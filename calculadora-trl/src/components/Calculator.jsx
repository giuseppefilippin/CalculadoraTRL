import React, { useState, useEffect } from "react";

function Calculator() {
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    const response = await fetch("http://localhost:5500/api/historico");
    const data = await response.json();
    setHistory(data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleCalculate = async () => {
    const response = await fetch("http://localhost:5500/api/calcular", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ valor1: input1, valor2: input2 }),
    });

    const data = await response.json();
    setResult(data.resultado);
    fetchHistory(); // Atualiza o histórico após calcular
  };

  return (
    <div>
      <h2>Calculadora TRL</h2>
      <input type="number" placeholder="Digite um valor" value={input1} onChange={(e) => setInput1(e.target.value)} />
      <input type="number" placeholder="Digite outro valor" value={input2} onChange={(e) => setInput2(e.target.value)} />
      <button onClick={handleCalculate}>Calcular</button>
      {result !== null && <p>Resultado: {result}</p>}

      <h3>Histórico de Cálculos</h3>
      <ul>
        {history.map((calc) => (
          <li key={calc.id}>
            {calc.valor1} + {calc.valor2} = {calc.resultado} (em {new Date(calc.data).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Calculator;
