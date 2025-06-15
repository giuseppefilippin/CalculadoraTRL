import { useEffect, useState } from "react";
import db from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function getPesosPergunta(nivel, perguntaTexto) {
  const pesosPorNivel = {
    "TRL 1": 1.5,
    "TRL 2": 1.6,
    "TRL 3": 1.7,
    "TRL 4": 1.8,
    "TRL 5": 1.9,
    "TRL 6": 2.0,
    "TRL 7": 2.1,
    "TRL 8": 2.2,
    "TRL 9": 2.3
  };

  const trlNum = nivel.split(":")[0].trim();
  const pesoBase = pesosPorNivel[trlNum] || 1.0;

  let pesoAjustado = pesoBase;

  const palavrasChave = {
    alto: ["crítico", "crítica", "essencial", "fundamental", "segurança", "legal", "regulamentação", "LGPD", "produção"],
    medio: ["teste", "testes", "testados", "validação", "documentação", "documentado", "requisito", "funcionalidade", "desempenho"],
    baixo: ["identificado", "levantado", "definido", "iniciado"]
  };

  if (palavrasChave.alto.some(p => perguntaTexto.toLowerCase().includes(p))) pesoAjustado *= 1.3;
  else if (palavrasChave.medio.some(p => perguntaTexto.toLowerCase().includes(p))) pesoAjustado *= 1.1;
  else if (palavrasChave.baixo.some(p => perguntaTexto.toLowerCase().includes(p))) pesoAjustado *= 0.9;

  return Math.round(pesoAjustado * 100) / 100;
}

function Step2({ formData, onFinish }) {
  const [trls, setTrls] = useState([]);
  const [currentTrlIndex, setCurrentTrlIndex] = useState(0);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const module = await import(`../perguntas/perguntas_${formData.areaSelecionada}.json`);
        const trlData = module.default;
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

  const salvarResultadoNoFirebase = async (notaFinal) => {
    const respostasPorNivel = trls.map((trl, trlIdx) => ({
      nivel: trl.nivel,
      perguntas: trl.perguntas.map((perguntaObj, idx) => ({
        pergunta: perguntaObj.pergunta,
        explicacao: perguntaObj.explicacao || "",
        resposta: responses[trlIdx][idx].resposta,
        comentario: responses[trlIdx][idx].comentario,
        peso: getPesosPergunta(trl.nivel, perguntaObj.pergunta)
      }))
    }));

    const doc = {
      ...formData,
      notaFinal,
      respostasPorNivel,
      timestamp: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "avaliacoes_trl"), doc);
      alert("Dados salvos com sucesso no Firebase!");
    } catch (error) {
      console.error("Erro ao salvar no Firebase:", error);
      alert("Erro ao salvar no Firebase.");
    }
  };

  const calcularNotaFinal = () => {
    const threshold = 0.8;
    let notaFinal = 0;
    const trlsComPesos = [];

    for (let i = 0; i < trls.length; i++) {
      const trl = trls[i];
      const respostas = responses[i];
      let somaPesos = 0;
      let somaPontos = 0;

      const perguntas = trl.perguntas.map((perguntaObj, idx) => {
        const peso = getPesosPergunta(trl.nivel, perguntaObj.pergunta);
        somaPesos += peso;
        if (respostas[idx].resposta === "sim") somaPontos += peso;

        return {
          pergunta: perguntaObj.pergunta,
          explicacao: perguntaObj.explicacao || "",
          resposta: respostas[idx].resposta,
          comentario: respostas[idx].comentario,
          peso
        };
      });

      trlsComPesos.push({ nivel: trl.nivel, perguntas });

      const mediaPonderada = somaPontos / somaPesos;
      if (mediaPonderada >= threshold) {
        notaFinal = i + 1;
      } else {
        break;
      }
    }

    salvarResultadoNoFirebase(notaFinal);

    if (typeof onFinish === "function") {
      onFinish(notaFinal, trlsComPesos);
    }
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
          {trlAtual?.perguntas?.map((perguntaObj, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>
                <strong>{perguntaObj.pergunta}</strong>
                {perguntaObj.explicacao && (
                  <p style={{ fontSize: "0.8em", color: "#666", marginTop: "4px" }}>
                    {perguntaObj.explicacao}
                  </p>
                )}
              </td>
              <td>
                <select
                  value={respostasTrlAtual[idx]?.resposta || ""}
                  onChange={(e) => handleChange(currentTrlIndex, idx, "resposta", e.target.value)}
                >
                  <option value="">-- Selecione --</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
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
          <button onClick={calcularNotaFinal}>Calcular TRL</button>
        )}
      </div>
    </section>
  );
}

export default Step2;
