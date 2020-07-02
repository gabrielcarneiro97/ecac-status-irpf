const Consulta = require('../../db/models/consulta.model');

module.exports = {
  consultas: async (pessoa) => {
    const consultas = await Consulta.porCpf(pessoa.cpf);
    return consultas.map((c) => c.toJSON());
  },
};
