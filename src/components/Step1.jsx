import { useState } from "react";

function Step1({ onStart }) {
  const [formData, setFormData] = useState({
    nomeTecnologia: "",
    status: "",
    nomeResponsavel: "",
    empresa: "",
    produto: "",
    trlInicial: "",
    trlFinal: "",
    ambienteRelevante: "",
    ambienteOperacional: "",
    areaSelecionada: "eletrica"
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = () => {
    onStart(formData);
  };

  return (
    <section className="step active">
      <h2>Informações Iniciais do Projeto</h2>
      <p>Preencha os campos abaixo para iniciar a avaliação:</p>

      <div className="form-group">
        <label htmlFor="nomeTecnologia">Projeto (Título):</label>
        <input
          type="text"
          id="nomeTecnologia"
          placeholder="Digite o título do projeto"
          value={formData.nomeTecnologia}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">Status:</label>
        <select id="status" value={formData.status} onChange={handleChange}>
          <option value="">-- Selecione --</option>
          <option value="Concluído">Concluído</option>
          <option value="Proposto">Proposto</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="nomeResponsavel">Pesquisador:</label>
        <input
          type="text"
          id="nomeResponsavel"
          placeholder="Nome do pesquisador responsável"
          value={formData.nomeResponsavel}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="empresa">Empresa/Cliente:</label>
        <input
          type="text"
          id="empresa"
          placeholder="(Opcional)"
          value={formData.empresa}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="produto">Produto / Processo:</label>
        <textarea
          id="produto"
          placeholder="Descreva o produto ou processo a ser desenvolvido"
          value={formData.produto}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="trlInicial">TRL inicial:</label>
        <input
          type="number"
          id="trlInicial"
          placeholder="Preencher se for uma proposta"
          value={formData.trlInicial}
          onChange={handleChange}
          min="1"
          max="9"
        />
      </div>

      <div className="form-group">
        <label htmlFor="trlFinal">TRL final:</label>
        <input
          type="number"
          id="trlFinal"
          placeholder="Informe o TRL final"
          value={formData.trlFinal}
          onChange={handleChange}
          min="1"
          max="9"
        />
      </div>

      <div className="form-group">
        <label htmlFor="ambienteRelevante">Ambiente relevante:</label>
        <textarea
          id="ambienteRelevante"
          placeholder="Descreva o ambiente relevante de testes"
          value={formData.ambienteRelevante}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="ambienteOperacional">Ambiente operacional:</label>
        <textarea
          id="ambienteOperacional"
          placeholder="Descreva o ambiente operacional do produto/processo"
          value={formData.ambienteOperacional}
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
          <option value="gerais">Gerais</option>
        </select>
      </div>

      <button onClick={handleSubmit}>Iniciar Avaliação</button>
    </section>
  );
}

export default Step1;
