const { Pool } = require("pg");

const pool = new Pool({
  user: "giuseppe", // Altere para seu usuário do PostgreSQL
  host: "localhost",
  database: "calculadora_trl", // O banco que criamos
  password: "sua_senha", // Substitua pela senha do PostgreSQL
  port: 5432, // Porta padrão do PostgreSQL
});

module.exports = pool;
