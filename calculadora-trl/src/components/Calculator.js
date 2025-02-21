import React, { useState } from "react";

function Calculator() {
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    // Exemplo de cálculo simples (você pode substituir pela lógica TRL)
    const calculation = parseFloat(input1) + parseFloat(input2);
    setResult(calculation);
  };

  return (
    <div style={styles.container}>
      <h2>Calculadora TRL</h2>
      <input
        type="number"
        placeholder="Digite um valor"
        value={input1}
        onChange={(e) => setInput1(e.target.value)}
        style={styles.input}
      />
      <input
        type="number"
        placeholder="Digite outro valor"
        value={input2}
        onChange={(e) => setInput2(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleCalculate} style={styles.button}>
        Calcular
      </button>
      {result !== null && <p>Resultado: {result}</p>}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    maxWidth: "400px",
    margin: "0 auto",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
  },
  input: {
    display: "block",
    width: "90%",
    margin: "10px auto",
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default Calculator;
