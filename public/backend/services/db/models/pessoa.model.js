const { DataTypes, Model } = require('sequelize');
const { db } = require('../db.service');

class Pessoa extends Model {}

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
