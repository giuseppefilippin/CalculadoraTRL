# 🚀 Calculadora TRL (Technology Readiness Level)

Uma aplicação web interativa para avaliação do nível de maturidade tecnológica (TRL) de projetos de inovação, utilizando as diretrizes TRL (de 1 a 9) e fluxos personalizados por área técnica (elétrica, eletrônica, hardware, software, geral).

## 🧰 Tecnologias Utilizadas

- **Frontend:** React + Vite
- **Backend e banco:** Firebase Firestore
- **Estilo:** CSS Modules / Tailwind (ajustável)
- **Hospedagem:** Firebase Hosting

---

## 🧮 Funcionalidades

- Coleta de dados iniciais do projeto (área, responsável, TRL inicial/final, etc.)
- Apresentação sequencial de perguntas por nível TRL
- Registro de respostas ("Sim" / "Não") com comentários
- Cálculo automático do TRL atingido com base em pesos ponderados
- Armazenamento dos dados no Firebase
- Interface amigável e responsiva

---

## 📁 Estrutura do Projeto

```
/src
├── componentes
│   ├── Step1.jsx        # Tela de entrada dos dados iniciais
│   ├── Step2.jsx        # Avaliação TRL interativa
|   ├── Resultado.jsx    # Resultados com gráficos
├── perguntas
│   ├── perguntas_eletrica.json
│   ├── perguntas_eletronica.json
│   ├── perguntas_hardware.json
│   ├── perguntas_software.json
│   └── perguntas_geral.json
├── firebase.js          # Configuração do Firebase
├── App.jsx              # Componente principal
└── main.jsx             # Ponto de entrada da aplicação
```

---

## 🔧 Como rodar localmente

### 1. Clone o projeto

```bash
git clone https://github.com/giuseppefilippin/CalculadoraTrl.git
cd calculadora-trl
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Firebase

Crie um projeto no [Firebase Console](https://console.firebase.google.com/), ative o **Firestore** e substitua os dados em `src/firebase.js`:

```js
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SUA_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
```

### 4. Execute a aplicação

```bash
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) para visualizar no navegador.

---

## 🧪 Scripts disponíveis

| Comando            | Função                                  |
|--------------------|------------------------------------------|
| `npm run dev`      | Inicia servidor local com Vite           |
| `npm run build`    | Gera build de produção                   |
| `npm run preview`  | Visualiza build local                    |

---

## 📊 Exemplo de uso

1. Selecione o TRL inicial e final, área de avaliação e dados do projeto.
2. Responda às perguntas de cada nível TRL.
3. Ao final, o sistema calcula automaticamente o TRL alcançado.
4. Os dados são salvos no Firestore com timestamp e detalhamento por nível.

---

## 📄 Licença

Este projeto está sob a licença MIT. Sinta-se livre para modificar, distribuir e usar com seus próprios dados TRL.

---

## ✨ Contribuições

Sugestões, melhorias e correções são bem-vindas! Abra uma *issue* ou envie um *pull request*.

---

## 💡 Créditos

Desenvolvido por [Seu Nome ou Equipe] com base nos critérios TRL adaptados para avaliação tecnológica aplicada.