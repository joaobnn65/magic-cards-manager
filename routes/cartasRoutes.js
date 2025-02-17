const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Middleware para verificar autenticação
function verificaAutenticacao(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect("/login");
    }
    next();
}

// Aplica autenticação a todas as rotas de cartas
router.use(verificaAutenticacao);

// 📌 Listar todas as cartas
router.get("/", async (req, res) => {
    try {
        const [cartas] = await pool.query(`
            SELECT cartas.id, cartas.nome, cartas.descricao, tipos.nome AS tipo 
            FROM cartas 
            JOIN tipos ON cartas.tipo_id = tipos.id
        `);
        res.render("index", { cartas, usuario: req.session.usuario });
    } catch (error) {
        console.error("Erro ao buscar cartas:", error);
        res.status(500).json({ error: "Erro ao buscar cartas." });
    }
});

// 📌 Exibir formulário de criação de carta
router.get("/new", (req, res) => {
    res.render("create", { usuario: req.session.usuario });
});

// 📌 Adicionar uma nova carta
router.post("/", async (req, res) => {
    const { nome, descricao, tipo_id } = req.body;

    try {
        if (!nome || !descricao || !tipo_id) {
            throw new Error("Todos os campos são obrigatórios.");
        }

        // Removendo usuario_id, pois sua tabela pode não ter essa coluna
        await pool.query(
            "INSERT INTO cartas (nome, descricao, tipo_id) VALUES (?, ?, ?)",
            [nome, descricao, tipo_id]
        );

        res.redirect("/cartas");
    } catch (error) {
        console.error("Erro ao adicionar carta:", error);
        res.status(500).send("Erro ao adicionar carta.");
    }
});

// 📌 Editar uma carta (Página de edição)
router.get("/edit/:id", async (req, res) => {
    try {
        const [cartas] = await pool.query("SELECT * FROM cartas WHERE id = ?", [req.params.id]);

        if (cartas.length === 0) {
            return res.status(404).send("Carta não encontrada.");
        }

        res.render("edit", { carta: cartas[0], usuario: req.session.usuario });
    } catch (error) {
        console.error("Erro ao carregar a edição da carta:", error);
        res.status(500).send("Erro ao carregar a edição da carta.");
    }
});

// 📌 Atualizar uma carta
router.post("/edit/:id", async (req, res) => {
    const { nome, descricao, tipo_id } = req.body;

    try {
        await pool.query(
            "UPDATE cartas SET nome = ?, descricao = ?, tipo_id = ? WHERE id = ?",
            [nome, descricao, tipo_id, req.params.id]
        );

        res.redirect("/cartas");
    } catch (error) {
        console.error("Erro ao atualizar a carta:", error);
        res.status(500).send("Erro ao atualizar a carta.");
    }
});

// 📌 Deletar uma carta
router.post("/delete/:id", async (req, res) => {
    try {
        await pool.query("DELETE FROM cartas WHERE id = ?", [req.params.id]);
        await pool.query("SET @count = 0;");
        await pool.query("UPDATE cartas SET id = @count:= @count + 1;");
        await pool.query("ALTER TABLE cartas AUTO_INCREMENT = 1;");

        res.redirect("/cartas");
    } catch (error) {
        console.error("Erro ao excluir a carta:", error);
        res.status(500).send("Erro ao excluir a carta.");
    }
});

// 📌 Buscar cartas com filtros e ordenação
router.get("/search", async (req, res) => {
    const { q, tipo, order } = req.query;

    try {
        let query = `
            SELECT cartas.id, cartas.nome, cartas.descricao, tipos.nome AS tipo 
            FROM cartas 
            JOIN tipos ON cartas.tipo_id = tipos.id 
            WHERE 1=1
        `;
        let params = [];

        if (q) {
            query += " AND cartas.nome LIKE ?";
            params.push(`%${q}%`);
        }

        if (tipo) {
            query += " AND cartas.tipo_id = ?";
            params.push(tipo);
        }

        if (order === "id") query += " ORDER BY cartas.id";
        else if (order === "nome") query += " ORDER BY cartas.nome";
        else if (order === "tipo") query += " ORDER BY tipo";
        else query += " ORDER BY cartas.id";

        const [cartas] = await pool.query(query, params);
        res.render("index", { cartas, q, tipo, order, usuario: req.session.usuario });
    } catch (error) {
        console.error("Erro ao buscar cartas:", error);
        res.status(500).send("Erro ao buscar cartas.");
    }
});

module.exports = router;
