const Pessoa = require('../../db/models/pessoa.model');
const { Consulta } = require('../../db/models');

const { db } = require('../../db/connection.service');

const worker = require('../../puppeteer/worker');

module.exports = {
  pessoa: async (_, { cpf }) => {
    const pessoaDb = await Pessoa.findByPk(cpf);

    if (!pessoaDb) return null;

    const consultas = await pessoaDb.todasConsultas();

    return { ...pessoaDb.toJSON(), consultas, ultimaConsulta: consultas[0] };
  },
  pessoas: async () => {
    const pessoasDb = await Pessoa.findAll({ order: [['cpf', 'ASC']] });
    const consultasDb = await Consulta.findAll({ order: [['pessoaCpf', 'ASC']] });

    return consultasDb.reduce((acc, consulta) => {
      let pessoa = acc.find((p) => p.cpf === consulta.pessoaCpf);
      const add = !pessoa;

      if (!pessoa) {
        pessoa = pessoasDb.find((p) => p.cpf === consulta.pessoaCpf)?.toJSON();
        pessoa.consultas = [];
        pessoa.ultimaConsulta = consulta;
      }

      if (pessoa.ultimaConsulta.dataHora <= consulta.dataHora) {
        pessoa.ultimaConsulta = consulta;
      }

      pessoa.consultas.push(consulta);

      if (add) return [...acc, pessoa];

      return acc;
    }, []);
  },

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

  pessoasUltimasConsultas: async () => {
    const sequelize = db();

    const pessoas = await Pessoa.findAll({ order: [['nome', 'ASC']] });

    const consultas = await sequelize.query(
      `SELECT c1.*
      FROM tb_consulta c1 LEFT JOIN tb_consulta c2
       ON (c1.pessoaCpf = c2.pessoaCpf AND c1.dataHora < c2.dataHora)
      WHERE c2.dataHora IS NULL;`,
      {
        model: Consulta,
        mapToModel: true,
      },
    );

    return pessoas.map((pessoa) => {
      const ultimaConsulta = consultas.find((consulta) => consulta.pessoaCpf === pessoa.cpf);

      return { ...pessoa.toJSON(), ultimaConsulta };
    });
  },
  workerStatus: async () => worker.workerStatus(),
};
