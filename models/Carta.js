const pool = require("../config/database");

class Carta {
  constructor(id, nome, descricao, tipo_id) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.tipo_id = tipo_id;
  }

  // 🔹 Listar todas as cartas
  static async listarTodas() {
    const [cartas] = await pool.query(`
      SELECT cartas.id, cartas.nome, cartas.descricao, tipos.nome AS tipo 
      FROM cartas 
      JOIN tipos ON cartas.tipo_id = tipos.id
    `);
    return cartas.map(c => new Carta(c.id, c.nome, c.descricao, c.tipo));
  }

  // 🔹 Buscar carta pelo ID
  static async buscarPorId(id) {
    const [cartas] = await pool.query("SELECT * FROM cartas WHERE id = ?", [id]);
    return cartas.length > 0 ? new Carta(cartas[0].id, cartas[0].nome, cartas[0].descricao, cartas[0].tipo_id) : null;
  }

  // 🔹 Criar nova carta
  static async criar(nome, descricao, tipo_id) {
    return pool.query("INSERT INTO cartas (nome, descricao, tipo_id) VALUES (?, ?, ?)", [nome, descricao, tipo_id]);
  }

  // 🔹 Atualizar uma carta existente
  static async atualizar(id, nome, descricao, tipo_id) {
    return pool.query("UPDATE cartas SET nome = ?, descricao = ?, tipo_id = ? WHERE id = ?", [nome, descricao, tipo_id, id]);
  }

  // 🔹 Excluir uma carta
  static async deletar(id) {
    await pool.query("DELETE FROM cartas WHERE id = ?", [id]);
    await pool.query("SET @count = 0;");
    await pool.query("UPDATE cartas SET id = @count:= @count + 1;");
    await pool.query("ALTER TABLE cartas AUTO_INCREMENT = 1;");
  }

  // 🔹 Executar consulta SQL customizada (usada na busca)
  static async executarQuery(query, params) {
    const [result] = await pool.query(query, params);
    return result;
  }
}

module.exports = Carta;
