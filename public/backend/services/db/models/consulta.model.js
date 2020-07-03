const { DataTypes, Model } = require('sequelize');
const { db } = require('../connection.service');

class Consulta extends Model {
  static async porCpf(cpf) {
    return Consulta.findAll({ where: { pessoaCpf: cpf }, order: [['dataHora', 'DESC']] });
  }

  static async criarConsulta(ano, status, cpf) {
    return Consulta.create({
      pessoaCpf: cpf,
      ano,
      status,
    });
  }

  static async ultimaConsulta(cpf) {
    Consulta.findOne({
      where: { pessoaCpf: cpf },
      order: [['dataHora', 'DESC']],
    });
  }
}

Consulta.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pessoaCpf: DataTypes.STRING,
  ano: DataTypes.INTEGER,
  status: DataTypes.STRING,
  dataHora: {
    type: DataTypes.TIME,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize: db(),
  tableName: 'tb_consulta',
  modelName: 'consulta',
});

module.exports = Consulta;
