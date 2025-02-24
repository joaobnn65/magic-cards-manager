const User = require("../models/User");
const bcrypt = require("bcryptjs");

class AuthController {
  static async login(req, res) {
    const { email, senha } = req.body;

    try {
      const usuario = await User.findByEmail(email);
      if (!usuario) return res.status(401).send("Usuário não encontrado.");

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) return res.status(401).send("Senha incorreta.");

      req.session.usuario = { id: usuario.id, nome: usuario.nome, email: usuario.email };
      res.redirect("/cartas");
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).send("Erro ao processar login.");
    }
  }

  static async register(req, res) {
    const { nome, email, senha } = req.body;

    try {
      const usuarioExistente = await User.findByEmail(email);
      if (usuarioExistente) return res.status(400).send("E-mail já cadastrado.");

      await User.createUser(nome, email, senha);
      res.redirect("/login");
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      res.status(500).send("Erro ao processar cadastro.");
    }
  }

  static logout(req, res) {
    req.session.destroy(() => res.redirect("/login"));
  }
}

module.exports = AuthController;
