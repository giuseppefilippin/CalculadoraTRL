import { useState } from "react";

function Step1({ onStart }) {
  const [formData, setFormData] = useState({
    nomeTecnologia: "",
    nomeResponsavel: "",
    dataAvaliacao: "",
    areaSelecionada: "eletrica", // valor padrão
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  return (
    <section className="step active">
      <h2>Bem-vindo à Calculadora TRL</h2>
      <p>Preencha as informações abaixo para começar a avaliação:</p>
      <div className="form-group">
        <label htmlFor="nomeTecnologia">Nome do Projeto/produto:</label>
        <input
          type="text"
          id="nomeTecnologia"
          placeholder="Digite o nome"
          value={formData.nomeTecnologia}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="nomeResponsavel">Responsável pela TC:</label>
        <input
          type="text"
          id="nomeResponsavel"
          placeholder="Digite o responsável"
          value={formData.nomeResponsavel}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="dataAvaliacao">Data da Avaliação:</label>
        <input
          type="date"
          id="dataAvaliacao"
          value={formData.dataAvaliacao}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="areaSelecionada">Área da Avaliação:</label>
        <select
          id="areaSelecionada"
          value={formData.areaSelecionada}
          onChange={handleChange}
        >
          <option value="eletrica">Elétrica</option>
          <option value="eletronica">Eletrônica</option>
          <option value="hardware">Hardware</option>
          <option value="software">Software</option>
        </select>
      </div>

      <button onClick={() => onStart(formData)}>Iniciar Avaliação</button>
    </section>
  );
}

export default Step1;
