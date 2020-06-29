const { DataTypes, Model } = require('sequelize');
const { db } = require('../connection.service');
const Pessoa = require('./pessoa.model');

class Consulta extends Model {}

Consulta.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  donoCpf: {
    type: DataTypes.STRING,
    references: {
      model: Pessoa,
      key: 'cpf',
    },
  },
  ano: DataTypes.INTEGER,
  status: DataTypes.INTEGER,
  dataHora: {
    type: DataTypes.TIME,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize: db(),
  tableName: 'tb_consulta',
});

module.exports = Consulta;
