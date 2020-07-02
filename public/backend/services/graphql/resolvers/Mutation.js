const Pessoa = require('../../db/models/pessoa.model');

module.exports = {
  excluirPessoa: async (cpf) => {
    const pessoa = await Pessoa.findByPk(cpf);
    return pessoa.excluir();
  },
  salvarPessoa: async (pessoa) => {
    const pessoaDb = await Pessoa.criarAtualizar(pessoa);
    return pessoaDb.toJSON();
  },
};
