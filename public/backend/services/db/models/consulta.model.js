const { DataTypes, Model } = require('sequelize');
const { db } = require('../db.service');
const Pessoa = require('./pessoa.model');

class Consulta extends Model {}

Consulta.init({
  donoCpf: {
    type: DataTypes.STRING,
    references: {
      model: Pessoa,
      key: 'cpf',
    },
  },
  dataHora: {
    type: DataTypes.TIME,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize: db(),
  tableName: 'tb_consulta',
});

module.exports = Consulta;
