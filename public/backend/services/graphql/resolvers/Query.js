const Pessoa = require('../../db/models/pessoa.model');
const { Consulta } = require('../../db/models');

const worker = require('../../puppeteer/worker');

module.exports = {
  pessoa: async (_, { cpf }) => (await Pessoa.findByPk(cpf))?.toJSON() || null,
  pessoas: async () => (await Pessoa.findAll({ order: [['nome', 'ASC']] })).map((c) => c.toJSON()),

  consultas: async (_, { cpf }) => (await Consulta.porCpf(cpf)).map((c) => c.toJSON()),

  consultaUnica: async (_, { pessoa, ano, pdf }) => {
    if (worker.isBusy()) return false;

    worker.consultaUnica(pessoa, ano, pdf).then(async ({ consulta }) => {
      const pessoaDb = await Pessoa.criarAtualizar(pessoa);
      await pessoaDb.inserirConsulta(consulta.ano, consulta.status);
    });

    return true;
  },

  consultaMultipla: async (_, { consultas, pdf }) => {
    if (worker.isBusy()) return false;

    worker.consultaMultipla(consultas, pdf, async ({ consulta, pessoa }) => {
      const pessoaDb = await Pessoa.criarAtualizar(pessoa);
      await pessoaDb.inserirConsulta(consulta.ano, consulta.status);
    });

    return true;
  },

  workerStatus: async () => worker.workerStatus(),
};
