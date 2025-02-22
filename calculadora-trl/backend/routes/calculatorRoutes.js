const express = require("express");
const pool = require("../database"); // Importa a conexão com o banco
const router = express.Router();

// 📌 Rota para calcular e salvar no banco de dados
router.post("/calcular", async (req, res) => {
  try {
    const { valor1, valor2 } = req.body;

    if (valor1 === undefined || valor2 === undefined) {
      return res.status(400).json({ error: "Os valores são obrigatórios" });
    }

    const num1 = parseFloat(valor1);
    const num2 = parseFloat(valor2);

    if (isNaN(num1) || isNaN(num2)) {
      return res.status(400).json({ error: "Os valores devem ser números válidos" });
    }

    const resultado = num1 + num2; // Substitua pela lógica TRL real

    // Insere no banco de dados
    const insertQuery = `
      INSERT INTO calculos (valor1, valor2, resultado)
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const { rows } = await pool.query(insertQuery, [num1, num2, resultado]);

    res.json(rows[0]); // Retorna o cálculo salvo
  } catch (error) {
    console.error("Erro no cálculo:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// 📌 Rota para listar todos os cálculos salvos no banco de dados
router.get("/historico", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM calculos ORDER BY data DESC;");
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

module.exports = router;
