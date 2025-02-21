const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const calculatorRoutes = require("./routes/calculatorRoutes");
app.use("/api", calculatorRoutes);

app.listen(5500, () => console.log("Servidor rodando na porta 5500"));
