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
  await page.setDefaultNavigationTimeout(10000);
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

  const err = await page.$('.login-caixa-erros-validacao');

  console.log(err);

  if (err) return false;

  await Promise.race([
    page.waitForSelector('#carregandoServicos', { hidden: true }),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ]);

  return true;
}

async function gotoIRPF(page, anoConsulta) {
  await page.goto(irpfUrl, { waitUntil: 'networkidle0' });

  // testar fechamento de janela de ajuda

  const janelaAjuda = await page.$(irpfSelectors.janelaAjuda);

  if (janelaAjuda && janelaAjuda?.offsetWidth !== 0) {
    page.click(irpfSelectors.fecharJanelaAjuda);
  }

  // await page.evaluate(({ janelaAjuda, fecharJanelaAjuda }) => {
  //   if (document.querySelector(janelaAjuda)) {
  //     if (document.querySelector(janelaAjuda).offsetWidth !== 0) {
  //       document.querySelector(fecharJanelaAjuda).click();
  //     }
  //   }
  // }, irpfSelectors);

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
  if (!validate(pessoa.cpf)) {
    return { status: 'CPF Inválido', ano, pessoaCpf: pessoa.cpf };
  }

  const browser = await setBrowser();
  try {
    const page = await setPage(browser);

    const login = await executeLogin(page, pessoa);

    if (!login) {
      finish(browser);
      return { status: 'Código de Acesso ou Senha Inválidos', ano, pessoaCpf: pessoa.cpf };
    }

    await gotoIRPF(page, ano);

    const status = await getStatus(page);

    if (savePDF) {
      await gotoExtrato(page);
      await saveExtratoToPDF(page, pessoa, ano);
    }

    finish(browser);

    return { status, ano, pessoaCpf: pessoa.cpf };
  } catch (err) {
    // finish(browser);
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
