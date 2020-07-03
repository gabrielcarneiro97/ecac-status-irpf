const puppeteer = require('puppeteer-core');
const chromium = require('chromium');
const isDev = require('electron-is-dev');

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

const { folders } = require('../paths.service');

const irpfDecUrl = (ano) => `${decUrl}/${ano}`;

async function setBrowser() {
  const chromiumPath = isDev ? chromium.path : chromium.path.replace('app.asar', 'app.asar.unpacked');
  return puppeteer.launch({ headless: true, executablePath: chromiumPath, timeout: 0 });
}

async function setPage(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.setDefaultNavigationTimeout(0);
  return page;
}

async function executeLogin(page, contribInfos) {
  await page.goto(ecacLoginUrl, { waitUntil: 'networkidle2' });

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

  await page.goto(irpfDecUrl(anoConsulta), { waitUntil: 'networkidle2' });

  return true;
}

async function getStatus(page) {
  return page.evaluate(
    ({ table }) => document.querySelector(table).children[2].children[5].innerText,
    decSelectors,
  );
}

async function gotoExtrato(page) {
  const [link] = await page.$x("//a[contains(., 'Extrato do Processamento')]");
  await link.click();
  await page.waitForSelector('.notLoading');

  return true;
}

async function saveExtratoToPDF(page, contribInfos, anoConsulta) {
  const folder = folders.extratos();

  await page.pdf({ path: `${folder}/${anoConsulta} - ${contribInfos.cpf} - ${contribInfos.nome}.pdf`, format: 'A4' });

  return true;
}

async function finish(browser) {
  return browser.close();
}

async function consultaPorCodigoAcesso(pessoa, ano, savePDF) {
  const browser = await setBrowser();
  try {
    const page = await setPage(browser);

    await executeLogin(page, pessoa);

    await gotoIRPF(page, ano);

    const status = await getStatus(page);

    if (savePDF) {
      await gotoExtrato(page);
      await saveExtratoToPDF(page, pessoa, ano);
    }

    await finish(browser);

    return { status, ano, pessoaCpf: pessoa.cpf };
  } catch (err) {
    await finish(browser);
    throw err;
  }
}

async function rfbAccessTime() {
  const init = new Date();
  const browser = await setBrowser();
  const page = await setPage(browser);

  await page.goto(ecacLoginUrl, { waitUntil: 'networkidle0' });

  await finish(browser);

  return new Date() - init;
}

async function loadChromium() {
  const browser = await setBrowser();
  finish(browser);
}

module.exports = {
  consultaPorCodigoAcesso,
  rfbAccessTime,
  loadChromium,
};
