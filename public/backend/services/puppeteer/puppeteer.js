const puppeteer = require('puppeteer-core');
const chromium = require('chromium');
const fs = require('fs');
const isDev = require('electron-is-dev');

const { readConfig } = require('../configManager');
const { writeData, readData } = require('../dataManager');
const { callEnd } = require('../ipcService');

const {
  ecacLoginUrl,
  irpfUrl,
  decUrl,
} = require('./urls.json');

const {
  ecacLoginSelectors,
  irpfSelectors,
  decSelectors,
} = require('./selectors.json');

const irpfDecUrl = (ano) => `${decUrl}/${ano}`;

async function setBrowser() {
  const chromiumPath = isDev ? chromium.path : chromium.path.replace('app.asar', 'app.asar.unpacked');
  return puppeteer.launch({ headless: true, executablePath: chromiumPath });
}

async function setPage(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  return page;
}

async function executeLogin(page, contribInfos) {
  await page.goto(ecacLoginUrl, { waitUntil: 'networkidle0' });

  await page.evaluate((selectors, contrib) => {
    const extractLogin = () => ({
      cpf: contrib.cpf,
      senha: contrib.senha,
      codigoAcesso: contrib.codigoAcesso,
    });

    const login = extractLogin();
    Object.keys(login).forEach((k) => {
      document.querySelector(selectors[k]).value = login[k];
    });
    document.querySelector(selectors.submit).click();
  }, ecacLoginSelectors, contribInfos);

  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  return true;
}

async function gotoIRPF(page, anoConsulta) {
  await page.goto(irpfUrl, { waitUntil: 'networkidle0' });

  await page.evaluate(({ janelaAjuda, fecharJanelaAjuda }) => {
    if (document.querySelector(janelaAjuda)) {
      if (document.querySelector(janelaAjuda).offsetWidth !== 0) {
        document.querySelector(fecharJanelaAjuda).click();
      }
    }
  }, irpfSelectors);

  await page.goto(irpfDecUrl(anoConsulta), { waitUntil: 'networkidle0' });

  return true;
}

async function getStatus(page) {
  return page.evaluate(
    ({ table }) => document.querySelector(table).children[1].children[5].innerText,
    decSelectors,
  );
}

async function gotoExtrato(page) {
  await page.evaluate(
    ({ extratoLink }) => document.querySelector(extratoLink).click(),
    decSelectors,
  );

  await page.waitForSelector('.notLoading');

  return true;
}

async function saveExtratoToPDF(page, contribInfos, anoConsulta) {
  const { folder } = readConfig();

  await page.pdf({ path: `${folder}/${anoConsulta} - ${contribInfos.cpf} - ${contribInfos.nome}.pdf`, format: 'A4' });

  return true;
}

async function finish(browser) {
  return browser.close();
}

async function checkStatus(contribInfos, anoConsulta, savePDF) {
  const browser = await setBrowser();
  try {
    const page = await setPage(browser);

    await executeLogin(page, contribInfos);

    await gotoIRPF(page, anoConsulta);

    const decStatus = await getStatus(page);

    await gotoExtrato(page);

    if (savePDF) await saveExtratoToPDF(page, contribInfos, anoConsulta);

    await finish(browser);

    return decStatus;
  } catch (err) {
    await finish(browser);
    throw err;
  }
}

function checkFolder(path) {
  try {
    fs.readdirSync(path);
  } catch (err) {
    if (err.errno === -4058) {
      fs.mkdirSync(path);
    }
  }
}

function divideData(data) {
  const { threadsMax } = readConfig();
  const pessoasSeparadas = [];

  let threadCounter = 0;
  for (let count = 0; count < data.length; count += 1) {
    const pessoa = data[count];
    if (!Array.isArray(pessoasSeparadas[threadCounter])) {
      pessoasSeparadas[threadCounter] = [];
    }

    pessoasSeparadas[threadCounter].push(pessoa);

    threadCounter += 1;

    if (threadCounter >= threadsMax) threadCounter = 0;
  }

  return pessoasSeparadas;
}

async function end(pessoa) {
  return Promise.all([
    writeData(pessoa),
    callEnd(pessoa),
  ]);
}

async function setThread(data, threadNum, anoConsulta, savePDF) {
  const threadResult = [];
  for (let count = 0; count < data.length; count += 1) {
    const pessoa = data[count];
    console.log(`${threadNum})`, pessoa.nome, ' - Começou');
    try {
      const decStatus = await checkStatus(pessoa, anoConsulta, savePDF); // eslint-disable-line

      console.log(`${threadNum})`, pessoa.nome, '-', `${anoConsulta} - ${decStatus}`);

      const result = { ...pessoa, decStatus: `${anoConsulta} - ${decStatus}` };
      await end(result); // eslint-disable-line
      threadResult.push(result);
    } catch (err) {
      console.error(err);
      console.log(`${threadNum})`, pessoa.nome, '-', `${anoConsulta} - Falha no Acesso`);
      const result = { ...pessoa, decStatus: `${anoConsulta} - Falha no Acesso` };
      await end(result); // eslint-disable-line
      threadResult.push(result);
    }
  }
  return threadResult;
}

async function startThreads(data, anoConsulta, savePDF) {
  return Promise.all(data.map((d, i) => setThread(d, i, anoConsulta, savePDF)));
}

async function rfbAccessTime() {
  const init = new Date();
  const browser = await setBrowser();
  const page = await setPage(browser);

  await page.goto(ecacLoginUrl, { waitUntil: 'networkidle0' });

  await finish(browser);

  return new Date() - init;
}

async function start(anoConsulta, savePDF) {
  const { folder, threadsMax, dataPath } = readConfig();

  process.setMaxListeners(threadsMax * 5);
  checkFolder(folder);
  const pessoas = await readData(dataPath);
  const pessoasSeparadas = divideData(pessoas);

  return startThreads(pessoasSeparadas, anoConsulta, savePDF);
}

async function loadChromium() {
  const browser = await setBrowser();
  finish(browser);
}

module.exports = {
  checkStatus,
  start,
  rfbAccessTime,
  loadChromium,
};
