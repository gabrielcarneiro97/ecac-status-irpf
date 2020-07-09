const { Cluster } = require('puppeteer-cluster');
const puppeteer = require('puppeteer-core');
const chromium = require('chromium');
const isDev = require('electron-is-dev');

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

  return { consulta, pessoa };
}

async function consultaMultipla(consultas, pdf, saveEach) {
  if (busy) {
    return { busy };
  }

  busy = true;

  const chromiumPath = isDev ? chromium.path : chromium.path.replace('app.asar', 'app.asar.unpacked');

  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_BROWSER,
    maxConcurrency: 3,
    // monitor: true,
    puppeteer,
    puppeteerOptions: { headless: true, executablePath: chromiumPath },
  });

  const total = consultas.length;
  const prop = 1 / total;

  await cluster.task(async ({ page, data: { pessoa, ano }, worker: { id } }) => {
    const consulta = await consultaPorCodigoAcesso(pessoa, ano, pdf, page);
    console.log(`${id} -> ${pessoa.nome}: ${consulta.ano} - ${consulta.status}`);
    await saveEach({ consulta, pessoa });
    progress += prop;
  });

  consultas.forEach((consulta) => cluster.queue(consulta));

  await cluster.idle();
  await cluster.close();

  busy = false;
  progress = 0;

  return true;
}

const workerStatus = () => ({ isBusy: isBusy(), progress });

setInterval(() => pubsup.publish('WORKER_STATUS', { workerStatus: workerStatus() }), 1000);

module.exports = {
  workerStatus,
  consultaUnica,
  consultaMultipla,
  isBusy,
  setProgress,
};
