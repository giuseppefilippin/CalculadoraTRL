import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

function Resultado({ nomeResponsavel, nomeTecnologia, notaFinal, trls, onReset }) {
  const labels = trls.map((_, i) => `TRL ${i + 1}`);
  const data = trls.map((trl) => {
    let somaPesos = 0;
    let somaPontos = 0;

    trl.perguntas.forEach((p) => {
      somaPesos += p.peso;
      if (p.resposta === "sim") somaPontos += p.peso;
    });

    return somaPesos > 0 ? Math.round((somaPontos / somaPesos) * 100) / 100 : 0;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "Desempenho por TRL",
        data,
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Resultado da Avaliação</h2>
      <p><strong>Projeto:</strong> {nomeTecnologia}</p>
      <p><strong>Responsável:</strong> {nomeResponsavel}</p>
      <p><strong>Nota Final TRL:</strong> TRL {notaFinal}</p>

      <div style={{ width: "80%", maxWidth: "600px", marginTop: "30px" }}>
        <Bar data={chartData} />
      </div>

      <button onClick={onReset} style={{ marginTop: "30px", padding: "10px 20px", fontSize: "16px" }}>
        Início
      </button>
    </div>
  );
}

export default Resultado;
