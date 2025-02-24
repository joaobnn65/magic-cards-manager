const express = require("express");
const router = express.Router();
const CartasController = require("../controllers/cartasController");

// 🔹 Página de busca de cartas
router.get("/search", CartasController.buscarCartas);

// 🔹 Página de criação de nova carta
router.get("/new", (req, res) => res.render("create", { usuario: req.session.usuario }));

// 🔹 Outras rotas de cartas
router.get("/", CartasController.listarCartas);
router.post("/", CartasController.criarCarta);
router.get("/edit/:id", CartasController.editarCarta);
router.post("/edit/:id", CartasController.atualizarCarta);
router.post("/delete/:id", CartasController.deletarCarta);

module.exports = router;
