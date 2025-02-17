// Importando o MySQL
const mysql = require("mysql2/promise");
require("dotenv").config();

// Criando a conexão com o banco de dados
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Testando a conexão
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("📌 Conectado ao banco de dados MySQL!");
    connection.release();
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco de dados:", error);
  }
}

// Executar teste de conexão
testConnection();

module.exports = pool;

require("dotenv").config();
console.log("🔍 Variáveis de ambiente carregadas:", process.env);

