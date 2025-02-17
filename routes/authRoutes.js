const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/database");

const router = express.Router();

// Página de Registro (GET)
router.get("/register", (req, res) => {
    res.render("register");
});

// Processar Cadastro de Usuário (POST)
router.post("/register", async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        await pool.query("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", 
            [nome, email, hashedPassword]);

        res.redirect("/login");
    } catch (error) {
        res.status(500).send("Erro ao cadastrar usuário.");
    }
});

// Página de Login (GET)
router.get("/login", (req, res) => {
    res.render("login");
});

// Processar Login (POST)
router.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    try {
        const [users] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(401).send("Usuário não encontrado.");
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(senha, user.senha);

        if (!isMatch) {
            return res.status(401).send("Senha incorreta.");
        }

        req.session.userId = user.id;
        res.redirect("/cartas");
    } catch (error) {
        res.status(500).send("Erro ao fazer login.");
    }
});

// Logout
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Erro ao encerrar sessão.");
        }
        res.redirect("/login"); // Redireciona para a tela de login após logout
    });
});

module.exports = router;
