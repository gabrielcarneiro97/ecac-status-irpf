const pubsup = require('../graphql/pubsub');

const Config = require('../db/models/config.model');

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

function createArray(fun, size, now = []) {
  if (size === 0) return now;
  return createArray(fun, size - 1, [...now, fun(now.length)]);
}

function* consultasGenerator(consultas) {
  yield* consultas;
}

async function createThread(iterator, pdf = false, prop = 0, id, data = []) {
  const { done, value } = iterator.next();

  if (done) return data;

  console.log(value);

  const consulta = await consultaPorCodigoAcesso(value.pessoa, value.ano, pdf);
  progress += prop;

  console.log(`${id} -> ${value.pessoa.nome}: ${consulta.ano} - ${consulta.status}`);

  return createThread(iterator, pdf, prop, id, [...data, { consulta, pessoa: value.pessoa }]);
}

async function consultaMultipla(consultas, pdf) {
  if (busy) {
    return { busy };
  }

  busy = true;

  const threadsQnt = 1;

  const consultasIterable = consultasGenerator(consultas);
  const total = consultas.length;
  const prop = 1 / total;

  const threads = createArray((i) => createThread(consultasIterable, pdf, prop, i), threadsQnt);

  const res = await Promise.all(threads);

  busy = false;
  progress = 0;

  return res.flat();
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
