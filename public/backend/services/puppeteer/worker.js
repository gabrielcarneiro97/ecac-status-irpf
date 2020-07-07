const pubsup = require('../graphql/pubsub');

const { consultaPorCodigoAcesso } = require('./puppeteer');

let busy = false;
let progress = 0;

function isBusy() {
  return busy;
}

function setProgress(p) {
  progress = p;
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

const workerStatus = () => ({ isBusy: isBusy(), progress });

setInterval(() => pubsup.publish('WORKER_STATUS', { workerStatus: workerStatus() }), 1000);

module.exports = {
  workerStatus,
  consultaUnica,
  isBusy,
  setProgress,
};
