const { DataTypes, Model } = require('sequelize');
const { db } = require('../connection.service');

const Consulta = require('./consulta.model');

class Pessoa extends Model {
  static async criarAtualizar(cpf, nome, codigoAcesso, senha) {
    let pessoa = await Pessoa.findByPk(cpf);

    if (pessoa) {
      pessoa.nome = nome;
      pessoa.codigoAcesso = codigoAcesso;
      pessoa.senha = senha;

      return pessoa.save();
    }

    pessoa = await Pessoa.create({
      cpf, nome, codigoAcesso, senha,
    });

    return pessoa.save();
  }

  async ultimaConsulta() {
    return Consulta.findOne({
      where: { donoCpf: this.cpf },
      order: [['dataHora', 'DESC']],
    });
  }

  async ultimaConsultaAno(ano) {
    return Consulta.findOne({
      where: { donoCpf: this.cpf, ano },
      order: [['dataHora', 'DESC']],
    });
  }

  async criarConsulta(ano, status) {
    const consulta = await Consulta.create({
      donoCpf: this.cpf,
      ano,
      status,
    });

    return consulta;
  }
}

Pessoa.init({
  cpf: {
    primaryKey: true,
    type: DataTypes.STRING,
  },
  nome: DataTypes.STRING,
  codigoAcesso: DataTypes.STRING,
  senha: DataTypes.STRING,
}, {
  sequelize: db(),
  tableName: 'tb_pessoa',
});

module.exports = Pessoa;
