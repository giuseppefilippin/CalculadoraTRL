const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Servidor da Calculadora TRL rodando!");
});

// Iniciando o servidor na porta 5000
const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
