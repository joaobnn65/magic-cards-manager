// Importando dependências
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const methodOverride = require("method-override");
const path = require("path");
const handlebars = require("handlebars");
const hbs = require("hbs");
const helpers = require("handlebars-helpers")();
const bcrypt = require("bcryptjs"); // Se estiver usando bcryptjs

// Inicializando o Express
const app = express();

// Configurando o template engine (Handlebars - HBS)
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Registrar helper "eq" para comparação
hbs.registerHelper(helpers);

// Middleware para processar formulários
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));

// Adiciona suporte a arquivos estáticos (CSS, JS, imagens)
app.use(express.static("public")); // <-- ADICIONE ESTA LINHA

// Configuração da sessão
app.use(
  session({
    secret: "chave_secreta_super_segura",
    resave: false,
    saveUninitialized: true,
  })
);

// Importando as rotas
const authRoutes = require("./routes/authRoutes");
const cartasRoutes = require("./routes/cartasRoutes");

// Definição das rotas
app.use("/", authRoutes);
app.use("/cartas", cartasRoutes);

// Rota principal
app.get("/", (req, res) => {
  res.send("🏆 Servidor rodando! Magic Cards Manager está no ar!");
});

// Definição da porta e inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
