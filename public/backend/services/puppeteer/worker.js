const { consultaPorCodigoAcesso } = require('./puppeteer');

let busy = false;

function isBusy() {
  return busy;
}

async function consultaUnica(pessoa, ano, pdf) {
  if (busy) {
    return { busy };
  }

  busy = true;
  const consulta = await consultaPorCodigoAcesso(pessoa, ano, pdf);
  busy = false;

  return consulta;
}

module.exports = {
  consultaUnica,
  isBusy,
};
