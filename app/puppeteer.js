const puppeteer = require('puppeteer');
const fs = require('fs');

const {
  anoConsulta,
  filePath,
  folder,
  threadsMax,
  separator,
} = require('./config.json');

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

process.setMaxListeners(threadsMax * 5);

const irpfDecUrl = (ano) => `${decUrl}/${ano}`;

async function setBrowser() {
  return puppeteer.launch({ headless: true });
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

async function gotoIRPF(page) {
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

async function saveExtratoToPDF(page, contribInfos) {
  await page.pdf({ path: `${folder}/${contribInfos.nome} - ${contribInfos.cpf}.pdf`, format: 'A4' });

  return true;
}

async function finish(browser) {
  return browser.close();
}

async function checkStatus(contribInfos) {
  const browser = await setBrowser();
  try {
    const page = await setPage(browser);

    await executeLogin(page, contribInfos);

    await gotoIRPF(page);

    const decStatus = await getStatus(page);

    await gotoExtrato(page);

    await saveExtratoToPDF(page, contribInfos);

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


function extractFileData(path) {
  const fileData = fs.readFileSync(path, 'utf8');

  const linhas = fileData.replace(/\r/g, '').split('\n');

  return linhas.map((linha) => {
    const [nome, cpf, codigoAcesso, senha] = linha.split(separator);
    return {
      nome,
      cpf,
      codigoAcesso,
      senha,
    };
  });
}

function saveData(resultArr) {
  let finalData = '';

  resultArr.forEach(({
    nome,
    cpf,
    codigoAcesso,
    senha,
    decStatus,
  }) => {
    finalData += `${nome},${cpf},${codigoAcesso},${senha},${decStatus}\n`;
  });

  fs.writeFileSync(filePath, finalData);
}

function divideData(data) {
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

async function setThread(data, threadNum) {
  const threadResult = [];
  for (let count = 0; count < data.length; count += 1) {
    const pessoa = data[count];
    console.log(`${threadNum})`, pessoa.nome, ' - Começou');
    try {
      const decStatus = await checkStatus(pessoa); // eslint-disable-line
      console.log(`${threadNum})`, pessoa.nome, '-', decStatus);
      threadResult.push({ ...pessoa, decStatus });
    } catch (err) {
      threadResult.push({ ...pessoa, decStatus: 'Falha no Acesso' });
      console.log(`${threadNum})`, pessoa.nome, ' - Falha no Acesso');
    }
  }
  return threadResult;
}

async function startThreads(data) {
  return Promise.all(data.map(setThread));
}

async function start() {
  checkFolder(folder);
  const pessoas = extractFileData(filePath);
  const pessoasSeparadas = divideData(pessoas);

  const resultArr = (await startThreads(pessoasSeparadas)).flat();

  saveData(resultArr);
  console.log('end');
}


module.exports = {
  checkStatus,
  start,
};
