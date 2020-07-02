const Pessoa = require('../../db/models/pessoa.model');
const Consulta = require('../../db/models/consulta.model');

module.exports = {
  pessoa: async (_, { cpf }) => (await Pessoa.findByPk(cpf)).toJSON(),
  consultas: async (_, { cpf }) => (await Consulta.porCpf(cpf)).map((c) => c.toJSON()),
};
