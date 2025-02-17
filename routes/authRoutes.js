const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const bcrypt = require("bcryptjs");

// 🔹 Exibir página de login
router.get("/login", (req, res) => {
    res.render("login");
});

// 🔹 Autenticar usuário (Login)
router.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    try {
        const [usuarios] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);

        if (usuarios.length === 0) {
            return res.status(401).send("Usuário não encontrado.");
        }

        const usuario = usuarios[0];

        // Verifica a senha com bcrypt
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).send("Senha incorreta.");
        }

        // Salva os dados do usuário na sessão
        req.session.usuario = { id: usuario.id, nome: usuario.nome, email: usuario.email };

        // Redireciona para a página de cartas
        res.redirect("/cartas");
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).send("Erro ao processar login.");
    }
});

// 🔹 Exibir página de cadastro
router.get("/register", (req, res) => {
    res.render("register");
});

// 🔹 Rota para cadastrar usuário
router.post("/register", async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        if (!nome || !email || !senha) {
            return res.status(400).send("Todos os campos são obrigatórios.");
        }

        const [usuarios] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);

        if (usuarios.length > 0) {
            return res.status(400).send("E-mail já cadastrado.");
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        await pool.query("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", 
            [nome, email, senhaCriptografada]);

        res.redirect("/login");
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        res.status(500).send("Erro ao processar cadastro.");
    }
});

// 🔹 Logout do usuário
// 📌 Rota de Logout
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Erro ao encerrar a sessão:", err);
            return res.status(500).send("Erro ao encerrar sessão.");
        }
        res.redirect("/login"); // Redireciona para a tela de login após logout
    });
});


module.exports = router;
