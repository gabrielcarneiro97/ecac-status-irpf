const puppeteer = require('puppeteer-core');
const chromium = require('chromium');
const isDev = require('electron-is-dev');
const { validate } = require('gerador-validador-cpf');

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
  return puppeteer.launch({ headless: true, executablePath: chromiumPath });
}

async function setPage(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  return page;
}

async function executeLogin(page, pessoa) {
  await page.goto(ecacLoginUrl, { waitUntil: 'networkidle2' });

  await page.evaluate((s, p) => {
    document.querySelector(s.cpf).value = p.cpf;
    document.querySelector(s.codigoAcesso).value = p.codigoAcesso;
    document.querySelector(s.senha).value = p.senha;
    document.querySelector(s.submit).click();
  }, ecacLoginSelectors, pessoa);

  try {
    const err = await page.$('.login-caixa-erros-validacao');

    if (err) return false;
  } catch {} // eslint-disable-line

  await page.waitForSelector('#carregandoServicos', { hidden: true });

  return true;
}

async function gotoIRPF(page, anoConsulta) {
  await page.goto(irpfUrl, { waitUntil: 'networkidle0' });

  await page.evaluate(({ janelaAjuda, fecharJanelaAjuda }) => {
    const janela = document.querySelector(janelaAjuda);
    if (janela && janela?.offsetWidth !== 0) {
      document.querySelector(fecharJanelaAjuda).click();
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

async function consultaPorCodigoAcesso(pessoa, ano, savePDF, clusterPage) {
  if (!validate(pessoa.cpf)) {
    return { status: 'CPF Inválido', ano, pessoaCpf: pessoa.cpf };
  }

  let browser;
  let page = clusterPage;

  if (!clusterPage) {
    browser = await setBrowser();
    page = await setPage(browser);
  }

  try {
    const login = await executeLogin(page, pessoa);

    if (!login) {
      if (browser) finish(browser);
      return { status: 'Código de Acesso ou Senha Inválidos', ano, pessoaCpf: pessoa.cpf };
    }

    await gotoIRPF(page, ano);

    const status = await getStatus(page);

    if (savePDF) {
      await gotoExtrato(page);
      await saveExtratoToPDF(page, pessoa, ano);
    }

    if (browser) finish(browser);
    return { status, ano, pessoaCpf: pessoa.cpf };
  } catch (err) {
    console.error(err);
    if (browser) finish(browser);
    return { status: 'Falha no Acesso', ano, pessoaCpf: pessoa.cpf };
  }
}

async function rfbAccessTime() {
  const init = new Date();
  const browser = await setBrowser();
  const page = await setPage(browser);

  await page.goto(ecacLoginUrl, { waitUntil: 'networkidle2' });

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
