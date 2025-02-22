// 🔹 Importando dependências
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const methodOverride = require("method-override");
const path = require("path");
const hbs = require("hbs");
const helpers = require("handlebars-helpers")();
const bcrypt = require("bcryptjs");
const helmet = require("helmet");
const cors = require("cors");
const csurf = require("csurf");
const cookieParser = require("cookie-parser"); // Necessário para CSRF

// 🔹 Middlewares personalizados
const logger = require("./middlewares/logger");
const authMiddleware = require("./middlewares/authMiddleware");

// 🔹 Inicializando o Express
const app = express();

// 🔹 Configurando o Handlebars (HBS)
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// 🔹 Registrar helper "eq" para comparação
hbs.registerHelper(helpers);

// 🔹 Aplicando Middlewares essenciais
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static("public"));

// 🔹 Segurança: Helmet, CORS e CSRF Protection
app.use(helmet()); // Proteção contra vulnerabilidades comuns na web
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser()); // CSRF precisa de cookie-parser
const csrfProtection = csurf({ cookie: true });

// 🔹 Configuração da sessão
app.use(
  session({
    secret: process.env.SESSION_SECRET || "chave_secreta_super_segura",
    resave: false,
    saveUninitialized: true,
  })
);

// 🔹 Middleware de logs (registrar todas as requisições)
app.use(logger);

// 🔹 Middleware Global para CSRF (todas as views terão acesso ao token)
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// 🔹 Importando rotas
const authRoutes = require("./routes/authRoutes");
const cartasRoutes = require("./routes/cartasRoutes");

// 🔹 Definição das rotas
app.use("/", authRoutes);
app.use("/cartas", cartasRoutes);

// 🔹 Rota principal
app.get("/", (req, res) => {
  res.send("🏆 Servidor rodando! Magic Cards Manager está no ar!");
});

// 🔹 Rota de login (Corrigida)
app.get("/login", (req, res) => {
  res.render("login");
});

// 🔹 Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
