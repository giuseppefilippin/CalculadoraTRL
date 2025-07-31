"use client";

import { useState, useEffect } from "react";
import Tooltip from "./Tooltip";

function Step1({ onStart }) {
  // Scroll para o topo quando o componente é montado
  useEffect(() => {
    // Força o scroll imediatamente
    window.scrollTo(0, 0);

    // E também com smooth behavior após um pequeno delay
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

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
    areasSelecionadas: [], // Array para múltiplas seleções - inicializar como array vazio
  });

  const [errors, setErrors] = useState({});

  const areas = [
    { value: "eletrica", label: "Elétrica" },
    { value: "eletronica", label: "Eletrônica" },
    { value: "hardware", label: "Hardware" },
    { value: "software", label: "Software" },
    { value: "materiais", label: "Materiais" },
    { value: "mecanica", label: "Mecânica" },
    //{ value: "gerais", label: "Gerais" },
  ];

  // Glossário de termos
  const glossario = {
    trlInicial:
      "O TRL inicial representa o nível de maturidade tecnológica atual do seu projeto. Varia de 1 (pesquisa básica) a 9 (tecnologia totalmente madura).",
    trlFinal:
      "O TRL final é o nível de maturidade que você pretende alcançar com este projeto. Deve ser igual ou maior que o TRL inicial.",
    ambienteRelevante:
      "Ambiente que simula as condições reais de operação da tecnologia, mas ainda em escala controlada. Por exemplo: laboratório especializado, ambiente de testes simulado, ou instalação piloto.",
    ambienteOperacional:
      "Ambiente real onde a tecnologia será efetivamente utilizada pelos usuários finais. Por exemplo: fábrica, hospital, residência, veículo, ou qualquer local de uso final da tecnologia.",
    produto:
      "Descreva o resultado tangível do seu projeto: pode ser um produto físico, software, processo, metodologia ou serviço que será desenvolvido ou aprimorado.",
    areas:
      "Selecione as principais áreas técnicas envolvidas no desenvolvimento da sua tecnologia. Você pode escolher múltiplas áreas se o projeto for multidisciplinar.",
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    // Clear error when user starts typing
    if (errors[id]) {
      setErrors({ ...errors, [id]: "" });
    }
  };

  const handleAreaChange = (areaValue) => {
    const updatedAreas = formData.areasSelecionadas.includes(areaValue)
      ? formData.areasSelecionadas.filter((area) => area !== areaValue)
      : [...formData.areasSelecionadas, areaValue];

    setFormData({ ...formData, areasSelecionadas: updatedAreas });

    // Clear error when user makes selection
    if (errors.areasSelecionadas) {
      setErrors({ ...errors, areasSelecionadas: "" });
    }
  };

  // Efeito para limpar o ambienteOperacional se TRL Final for menor que 7
  useEffect(() => {
    const trlFinalNum = Number(formData.trlFinal);
    if (trlFinalNum < 7 && formData.ambienteOperacional !== "") {
      setFormData((prevData) => ({
        ...prevData,
        ambienteOperacional: "",
      }));
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.ambienteOperacional;
        return newErrors;
      });
    }
  }, [formData.trlFinal, formData.ambienteOperacional]);

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
    if (
      !formData.trlInicial ||
      formData.trlInicial < 1 ||
      formData.trlInicial > 9
    ) {
      newErrors.trlInicial = "TRL inicial deve ser entre 1 e 9";
    }
    if (!formData.trlFinal || formData.trlFinal < 1 || formData.trlFinal > 9) {
      newErrors.trlFinal = "TRL final deve ser entre 1 e 9";
    }
    if (!formData.ambienteRelevante.trim()) {
      newErrors.ambienteRelevante = "Ambiente relevante é obrigatório";
    }

    // Validação condicional para ambienteOperacional
    if (
      Number(formData.trlFinal) >= 7 &&
      !formData.ambienteOperacional.trim()
    ) {
      newErrors.ambienteOperacional =
        "Ambiente operacional é obrigatório para TRL Final >= 7";
    }

    if (formData.areasSelecionadas.length === 0) {
      newErrors.areasSelecionadas =
        "Selecione pelo menos uma área de avaliação";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onStart(formData);
    } else {
      // Encontra o primeiro campo com erro e rola até ele
      const firstErrorField = Object.keys(errors).find((key) => errors[key]);
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  };

  const showAmbienteOperacional = Number(formData.trlFinal) >= 7;

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-16">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Informações Iniciais do Projeto
          </h2>
          <p className="text-blue-100">
            Preencha os campos abaixo para iniciar a avaliação de maturidade
            tecnológica
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Projeto */}
            <div className="md:col-span-2">
              <label
                htmlFor="nomeTecnologia"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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
              {errors.nomeTecnologia && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nomeTecnologia}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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
                <option value="Em andamento">Em andamento</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status}</p>
              )}
            </div>

            {/* Pesquisador */}
            <div>
              <label
                htmlFor="nomeResponsavel"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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
              {errors.nomeResponsavel && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nomeResponsavel}
                </p>
              )}
            </div>

            {/* Empresa */}
            <div className="md:col-span-2">
              <label
                htmlFor="empresa"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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
              <label
                htmlFor="produto"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                Produto/Processo *
                <Tooltip content={glossario.produto} position="top">
                  <svg
                    className="w-4 h-4 ml-2 text-gray-400 hover:text-blue-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </Tooltip>
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
              {errors.produto && (
                <p className="mt-1 text-sm text-red-600">{errors.produto}</p>
              )}
            </div>

            {/* TRL Inicial */}
            <div>
              <label
                htmlFor="trlInicial"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                TRL Inicial *
                <Tooltip content={glossario.trlInicial} position="top">
                  <svg
                    className="w-4 h-4 ml-2 text-gray-400 hover:text-blue-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </Tooltip>
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
              {errors.trlInicial && (
                <p className="mt-1 text-sm text-red-600">{errors.trlInicial}</p>
              )}
            </div>

            {/* TRL Final */}
            <div>
              <label
                htmlFor="trlFinal"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                TRL Final *
                <Tooltip content={glossario.trlFinal} position="top">
                  <svg
                    className="w-4 h-4 ml-2 text-gray-400 hover:text-blue-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </Tooltip>
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
              {errors.trlFinal && (
                <p className="mt-1 text-sm text-red-600">{errors.trlFinal}</p>
              )}
            </div>

            {/* Ambiente Relevante */}
            <div>
              <label
                htmlFor="ambienteRelevante"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                Ambiente Relevante *
                <Tooltip content={glossario.ambienteRelevante} position="top">
                  <svg
                    className="w-4 h-4 ml-2 text-gray-400 hover:text-blue-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </Tooltip>
              </label>
              <textarea
                id="ambienteRelevante"
                rows={3}
                placeholder="Descreva o ambiente relevante de testes"
                value={formData.ambienteRelevante}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                  errors.ambienteRelevante
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
              />
              {errors.ambienteRelevante && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.ambienteRelevante}
                </p>
              )}
            </div>

            {/* Ambiente Operacional - Renderizado condicionalmente */}
            {showAmbienteOperacional && (
              <div>
                <label
                  htmlFor="ambienteOperacional"
                  className="flex items-center text-sm font-medium text-gray-700 mb-2"
                >
                  Ambiente Operacional *
                  <Tooltip
                    content={glossario.ambienteOperacional}
                    position="top"
                  >
                    <svg
                      className="w-4 h-4 ml-2 text-gray-400 hover:text-blue-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </Tooltip>
                </label>
                <textarea
                  id="ambienteOperacional"
                  rows={3}
                  placeholder="Descreva o ambiente operacional do produto/processo"
                  value={formData.ambienteOperacional}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                    errors.ambienteOperacional
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                />
                {errors.ambienteOperacional && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.ambienteOperacional}
                  </p>
                )}
              </div>
            )}

            {/* Áreas de Avaliação - Múltipla Seleção */}
            <div className="md:col-span-2">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                O principal produto/processo do projeto envolve desenvolvimentos
                em: *
                <Tooltip content={glossario.areas} position="top">
                  <svg
                    className="w-4 h-4 ml-2 text-gray-400 hover:text-blue-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </Tooltip>
              </label>
              <div
                className={`grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-lg ${
                  errors.areasSelecionadas
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                {areas.map((area) => (
                  <label
                    key={area.value}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.areasSelecionadas.includes(area.value)}
                      onChange={() => handleAreaChange(area.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {area.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.areasSelecionadas && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.areasSelecionadas}
                </p>
              )}

              {/* Mostrar áreas selecionadas */}
              {formData.areasSelecionadas.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">
                    Áreas selecionadas:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.areasSelecionadas.map((area) => {
                      const areaLabel = areas.find(
                        (a) => a.value === area
                      )?.label;
                      return (
                        <span
                          key={area}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {areaLabel}
                          <button
                            type="button"
                            onClick={() => handleAreaChange(area)}
                            className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 focus:outline-none"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Iniciar Avaliação
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step1;
