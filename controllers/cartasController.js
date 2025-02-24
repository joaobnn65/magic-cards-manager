const Carta = require("../models/Carta");

class CartasController {
  // 🔹 Listar todas as cartas
  static async listarCartas(req, res) {
    try {
      const cartas = await Carta.listarTodas();
      res.render("index", { cartas, usuario: req.session.usuario });
    } catch (error) {
      console.error("Erro ao buscar cartas:", error);
      res.status(500).json({ error: "Erro ao buscar cartas." });
    }
  }

  // 🔹 Criar nova carta
  static async criarCarta(req, res) {
    const { nome, descricao, tipo_id } = req.body;
    try {
      if (!nome || !descricao || !tipo_id) {
        return res.status(400).send("Todos os campos são obrigatórios.");
      }
      await Carta.criar(nome, descricao, tipo_id);
      res.redirect("/cartas");
    } catch (error) {
      console.error("Erro ao adicionar carta:", error);
      res.status(500).send("Erro ao adicionar carta.");
    }
  }

  // 🔹 Exibir formulário de edição de carta
  static async editarCarta(req, res) {
    try {
      const carta = await Carta.buscarPorId(req.params.id);
      if (!carta) {
        return res.status(404).send("Carta não encontrada.");
      }
      res.render("edit", { carta, usuario: req.session.usuario });
    } catch (error) {
      console.error("Erro ao carregar edição:", error);
      res.status(500).send("Erro ao carregar edição.");
    }
  }

  // 🔹 Atualizar uma carta
  static async atualizarCarta(req, res) {
    const { nome, descricao, tipo_id } = req.body;
    try {
      if (!nome || !descricao || !tipo_id) {
        return res.status(400).send("Todos os campos são obrigatórios.");
      }
      await Carta.atualizar(req.params.id, nome, descricao, tipo_id);
      res.redirect("/cartas");
    } catch (error) {
      console.error("Erro ao atualizar carta:", error);
      res.status(500).send("Erro ao atualizar carta.");
    }
  }

  // 🔹 Excluir uma carta
  static async deletarCarta(req, res) {
    try {
      await Carta.deletar(req.params.id);
      res.redirect("/cartas");
    } catch (error) {
      console.error("Erro ao excluir carta:", error);
      res.status(500).send("Erro ao excluir carta.");
    }
  }

  // 🔹 Buscar cartas com filtros e ordenação
  static async buscarCartas(req, res) {
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

      const cartas = await Carta.executarQuery(query, params);
      res.render("index", { cartas, q, tipo, order, usuario: req.session.usuario });
    } catch (error) {
      console.error("Erro ao buscar cartas:", error);
      res.status(500).send("Erro ao buscar cartas.");
    }
  }
}

module.exports = CartasController;
