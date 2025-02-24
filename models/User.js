const pool = require("../config/database");
const bcrypt = require("bcryptjs");

class User {
  constructor(id, nome, email, senha) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
  }

  static async findByEmail(email) {
    const [usuarios] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    return usuarios.length > 0 ? new User(usuarios[0].id, usuarios[0].nome, usuarios[0].email, usuarios[0].senha) : null;
  }

  static async createUser(nome, email, senha) {
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    return pool.query("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", [nome, email, senhaCriptografada]);
  }
}

module.exports = User;
