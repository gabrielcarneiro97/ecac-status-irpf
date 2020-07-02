const Pessoa = require('../../db/models/pessoa.model');
const Consulta = require('../../db/models/consulta.model');

const consultasMoc = [
  {
    id: 1,
    ano: '2020',
    dataHora: +new Date(),
    status: 'Falha no Acesso',
    donoCpf: '09392070608',
  },
  {
    id: 2,
    ano: '2020',
    dataHora: +new Date(),
    status: 'Processada',
    donoCpf: '09392070608',
  },
  {
    id: 3,
    ano: '2020',
    dataHora: +new Date(),
    status: 'Malha Fina',
    donoCpf: '63922355668',
  },
  {
    id: 4,
    ano: '2020',
    dataHora: +new Date(),
    status: 'Malha Fina',
    donoCpf: '63922355668',
  },
];

module.exports = {
  pessoa: async (_, { cpf }) => (await Pessoa.findByPk(cpf))?.toJSON() || null,
  // consultas: async (_, { cpf }) => (await Consulta.porCpf(cpf)).map((c) => c.toJSON()),
  consultas: async (_, { cpf }) => {
    console.log(cpf);
    return consultasMoc.filter((v) => v.donoCpf === cpf);
  },
};
