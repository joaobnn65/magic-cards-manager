const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");

// 🔹 Rota para exibir página de login
router.get("/login", (req, res) => {
    res.render("login");
});

// 🔹 Rota para autenticar usuário (Login)
router.post("/login", AuthController.login);

// 🔹 Rota para exibir página de cadastro
router.get("/register", (req, res) => {
    res.render("register");
});

// 🔹 Rota para cadastrar usuário
router.post("/register", AuthController.register);

// 🔹 Rota para logout do usuário
router.get("/logout", AuthController.logout);

module.exports = router;
