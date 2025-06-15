import { useEffect, useState } from "react";
import db from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function Step2({ formData }) {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [responses, setResponses] = useState([]);

  const itemsPerPage = 5;

  useEffect(() => {
    async function loadQuestions() {
      try {
        const module = await import(`../perguntas/perguntas_${formData.areaSelecionada}.json`);
        setQuestions(module.default);
        setResponses(
          module.default.map((q) => ({ id: q.id, resposta: "", comentario: "" }))
        );
      } catch (error) {
        console.error("Erro ao carregar perguntas:", error);
      }
    }

    loadQuestions();
  }, [formData.areaSelecionada]);

  const handleChange = (index, field, value) => {
    const updated = [...responses];
    updated[index][field] = value;
    setResponses(updated);
  };

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "respostas_trl"), {
        ...formData,
        respostas: responses,
        timestamp: serverTimestamp(),
      });
      alert("Respostas salvas com sucesso no Firebase!");
    } catch (e) {
      console.error("Erro ao salvar no Firebase:", e);
      alert("Erro ao salvar. Verifique o console.");
    }
  };

  const paginated = questions.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <section className="step">
      <h2>Etapa de Avaliação</h2>
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
          {paginated.map((q, idx) => (
            <tr key={q.id}>
              <td>{(currentPage * itemsPerPage) + idx + 1}</td>
              <td>{q.pergunta}</td>
              <td>
                <select
                  value={responses[q.id - 1]?.resposta || ""}
                  onChange={(e) => handleChange(q.id - 1, "resposta", e.target.value)}
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
                  value={responses[q.id - 1]?.comentario || ""}
                  onChange={(e) => handleChange(q.id - 1, "comentario", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <button disabled={currentPage === 0} onClick={() => setCurrentPage(p => p - 1)}>
          Anterior
        </button>
        <button disabled={(currentPage + 1) * itemsPerPage >= questions.length}
                onClick={() => setCurrentPage(p => p + 1)}>
          Próximo
        </button>
        <button onClick={handleSubmit}>Calcular TRL</button>
      </div>
    </section>
  );
}

export default Step2;
