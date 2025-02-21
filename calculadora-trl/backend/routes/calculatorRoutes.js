const express = require("express");
const router = express.Router();

// Rota para calcular valores (exemplo simples, substitua pela lógica TRL)
router.post("/calcular", (req, res) => {
    try {
        const { valor1, valor2 } = req.body;

        // Verificar se os valores foram enviados corretamente
        if (valor1 === undefined || valor2 === undefined) {
            return res.status(400).json({ error: "Os valores são obrigatórios" });
        }

        // Converter para número e realizar um cálculo de exemplo (soma)
        const num1 = parseFloat(valor1);
        const num2 = parseFloat(valor2);

        if (isNaN(num1) || isNaN(num2)) {
            return res.status(400).json({ error: "Os valores devem ser números válidos" });
        }

        const resultado = num1 + num2; // Exemplo de cálculo, substitua pela lógica TRL

        res.json({ resultado });
    } catch (error) {
        console.error("Erro no cálculo:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});

module.exports = router;
