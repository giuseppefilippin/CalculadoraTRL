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
    areaSelecionada: "software"
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors({ ...errors, [id]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nomeTecnologia.trim()) {
      newErrors.nomeTecnologia = "Título do projeto é obrigatório";
    }
    if (!formData.status) {
      newErrors.status = "Status é obrigatório";
    }
    if (!formData.nomeResponsavel.trim()) {
      newErrors.nomeResponsavel = "Nome do pesquisador é obrigatório";
    }
    if (!formData.produto.trim()) {
      newErrors.produto = "Descrição do produto/processo é obrigatória";
    }
    if (!formData.trlInicial || formData.trlInicial < 1 || formData.trlInicial > 9) {
      newErrors.trlInicial = "TRL inicial deve ser entre 1 e 9";
    }
    if (!formData.trlFinal || formData.trlFinal < 1 || formData.trlFinal > 9) {
      newErrors.trlFinal = "TRL final deve ser entre 1 e 9";
    }
    if (!formData.ambienteRelevante.trim()) {
      newErrors.ambienteRelevante = "Ambiente relevante é obrigatório";
    }
    if (!formData.ambienteOperacional.trim()) {
      newErrors.ambienteOperacional = "Ambiente operacional é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onStart(formData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
          <h2 className="text-2xl font-bold text-white mb-2">Informações Iniciais do Projeto</h2>
          <p className="text-blue-100">Preencha os campos abaixo para iniciar a avaliação de maturidade tecnológica</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Projeto */}
            <div className="md:col-span-2">
              <label htmlFor="nomeTecnologia" className="block text-sm font-medium text-gray-700 mb-2">
                Projeto (Título) *
              </label>
              <input
                type="text"
                id="nomeTecnologia"
                placeholder="Digite o título do projeto"
                value={formData.nomeTecnologia}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.nomeTecnologia ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.nomeTecnologia && <p className="mt-1 text-sm text-red-600">{errors.nomeTecnologia}</p>}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status do Projeto *
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.status ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="">-- Selecione --</option>
                <option value="Concluído">Concluído</option>
                <option value="Proposto">Proposto</option>
              </select>
              {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
            </div>

            {/* Pesquisador */}
            <div>
              <label htmlFor="nomeResponsavel" className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Pesquisador *
              </label>
              <input
                type="text"
                id="nomeResponsavel"
                placeholder="Nome do pesquisador responsável"
                value={formData.nomeResponsavel}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.nomeResponsavel ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.nomeResponsavel && <p className="mt-1 text-sm text-red-600">{errors.nomeResponsavel}</p>}
            </div>

            {/* Empresa */}
            <div className="md:col-span-2">
              <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 mb-2">
                Empresa/Cliente
              </label>
              <input
                type="text"
                id="empresa"
                placeholder="Nome da empresa ou cliente (opcional)"
                value={formData.empresa}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Produto/Processo */}
            <div className="md:col-span-2">
              <label htmlFor="produto" className="block text-sm font-medium text-gray-700 mb-2">
                Produto/Processo *
              </label>
              <textarea
                id="produto"
                rows={4}
                placeholder="Descreva o produto ou processo desenvolvido ou a ser desenvolvido"
                value={formData.produto}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                  errors.produto ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.produto && <p className="mt-1 text-sm text-red-600">{errors.produto}</p>}
            </div>

            {/* TRL Inicial */}
            <div>
              <label htmlFor="trlInicial" className="block text-sm font-medium text-gray-700 mb-2">
                TRL Inicial *
              </label>
              <input
                type="number"
                id="trlInicial"
                min="1"
                max="9"
                placeholder="1-9"
                value={formData.trlInicial}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.trlInicial ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.trlInicial && <p className="mt-1 text-sm text-red-600">{errors.trlInicial}</p>}
            </div>

            {/* TRL Final */}
            <div>
              <label htmlFor="trlFinal" className="block text-sm font-medium text-gray-700 mb-2">
                TRL Final *
              </label>
              <input
                type="number"
                id="trlFinal"
                min="1"
                max="9"
                placeholder="1-9"
                value={formData.trlFinal}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.trlFinal ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.trlFinal && <p className="mt-1 text-sm text-red-600">{errors.trlFinal}</p>}
            </div>

            {/* Ambiente Relevante */}
            <div>
              <label htmlFor="ambienteRelevante" className="block text-sm font-medium text-gray-700 mb-2">
                Ambiente Relevante *
              </label>
              <textarea
                id="ambienteRelevante"
                rows={3}
                placeholder="Descreva o ambiente relevante de testes"
                value={formData.ambienteRelevante}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                  errors.ambienteRelevante ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.ambienteRelevante && <p className="mt-1 text-sm text-red-600">{errors.ambienteRelevante}</p>}
            </div>

            {/* Ambiente Operacional */}
            <div>
              <label htmlFor="ambienteOperacional" className="block text-sm font-medium text-gray-700 mb-2">
                Ambiente Operacional *
              </label>
              <textarea
                id="ambienteOperacional"
                rows={3}
                placeholder="Descreva o ambiente operacional do produto/processo"
                value={formData.ambienteOperacional}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                  errors.ambienteOperacional ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.ambienteOperacional && <p className="mt-1 text-sm text-red-600">{errors.ambienteOperacional}</p>}
            </div>

            {/* Área de Avaliação */}
            <div className="md:col-span-2">
              <label htmlFor="areaSelecionada" className="block text-sm font-medium text-gray-700 mb-2">
                O principal produto/processo do projeto envolve desenvolvimento de: *
              </label>
              <select
                id="areaSelecionada"
                value={formData.areaSelecionada}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="eletrica">Elétrica</option>
                <option value="eletronica">Eletrônica</option>
                <option value="hardware">Hardware</option>
                <option value="software">Software</option>
                <option value="gerais">Gerais</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Iniciar Avaliação
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step1;