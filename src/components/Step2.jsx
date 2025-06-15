// src/components/Step2.jsx
import { useEffect, useState } from "react";

function Step2({ formData }) {
  const [trls, setTrls] = useState([]);
  const [currentTrlIndex, setCurrentTrlIndex] = useState(0);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const module = await import(`../perguntas/perguntas_${formData.areaSelecionada}.json`);
        const trlData = module.default;

        // Inicializa respostas com base na estrutura do JSON
        const initialResponses = trlData.map((trl) =>
          trl.perguntas.map(() => ({ resposta: "", comentario: "" }))
        );

        setTrls(trlData);
        setResponses(initialResponses);
      } catch (error) {
        console.error("Erro ao carregar perguntas:", error);
      }
    }

    loadQuestions();
  }, [formData.areaSelecionada]);

  const handleChange = (trlIdx, perguntaIdx, field, value) => {
    const updated = [...responses];
    updated[trlIdx][perguntaIdx][field] = value;
    setResponses(updated);
  };

  const trlAtual = trls[currentTrlIndex];
  const respostasTrlAtual = responses[currentTrlIndex] || [];

  return (
    <section className="step">
      <h2>{trlAtual?.nivel || "Carregando TRLs..."}</h2>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Pergunta</th>
            <th>Resposta</th>
            <th>Comentário</th>
          </tr>
        </thead>
        <tbody>
          {trlAtual?.perguntas?.map((pergunta, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{pergunta}</td>
              <td>
                <select
                  value={respostasTrlAtual[idx]?.resposta || ""}
                  onChange={(e) => handleChange(currentTrlIndex, idx, "resposta", e.target.value)}
                >
                  <option value="">-- Selecione --</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                  <option value="parcial">Parcialmente</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={respostasTrlAtual[idx]?.comentario || ""}
                  onChange={(e) => handleChange(currentTrlIndex, idx, "comentario", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <button disabled={currentTrlIndex === 0} onClick={() => setCurrentTrlIndex((i) => i - 1)}>
          Anterior
        </button>

        {currentTrlIndex < trls.length - 1 ? (
          <button onClick={() => setCurrentTrlIndex((i) => i + 1)}>Próximo</button>
        ) : (
          <button onClick={() => alert("Fim da avaliação. Em breve: envio ao Firebase.")}>Calcular TRL</button>
        )}
      </div>
    </section>
  );
}

export default Step2;
