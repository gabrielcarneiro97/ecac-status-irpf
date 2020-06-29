const { DataTypes, Model } = require('sequelize');
const { db } = require('../connection.service');

class Config extends Model {
  static async getConfig(nome) {
    const data = await Config.findByPk(nome);
    return data.valor;
  }

  static async createConfig(nome, valor) {
    return Config.create({ nome, valor });
  }

  static async createConfigs(configs) {
    return Config.bulkCreate(configs);
  }

  static async updateConfig(nome, valor) {
    const data = await Config.findByPk(nome);

    data.valor = valor;

    await data.save();

    return valor;
  }
}

Config.init({
  nome: {
    primaryKey: true,
    type: DataTypes.STRING,
  },
  valor: DataTypes.STRING,
}, {
  sequelize: db(),
  tableName: 'tb_config',
});

module.exports = Config;
