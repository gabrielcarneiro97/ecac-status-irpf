const puppeteer = require('puppeteer');
const fs = require('fs');

const anoConsulta = '2019';
const filePath = './dados.csv';
const folder = './extratos';
const threadsMax = 10;
process.setMaxListeners(threadsMax * 5);

const ecacLoginUrl = 'https://cav.receita.fazenda.gov.br/autenticacao/login';

const ecacLoginSelectors = {
  cpf: '#NI',
  codigoAcesso: '#CodigoAcesso',
  senha: '#Senha',
  submit: '#login-dados-usuario > p > .submit',
};

const irpfUrl = 'https://www3.cav.receita.fazenda.gov.br/extratodirpf/';

const irpfSelectors = {
  janelaAjuda: '#helppanel_text', // offsetWidth !== 0
  fecharJanelaAjuda: '.campo_sele_help > .btClos.glyphicon.glyphicon-remove', // click()
};

const irpfDecUrl = (ano) => `https://www3.cav.receita.fazenda.gov.br/extratodirpf/#/anoexercicio/${ano}`;

const decSelectors = {
  table: 'eir-declaracoes > table > tbody', // processamento -> children[1].children[5]
  extratoLink: "[title='Obter informações sobre o processamento da declaração do IRPF.']",
};

async function checkStatus(contribInfos) {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
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

    await page.goto(irpfUrl, { waitUntil: 'networkidle0' });

    await page.evaluate(({ janelaAjuda, fecharJanelaAjuda }) => {
      if (document.querySelector(janelaAjuda)) {
        if (document.querySelector(janelaAjuda).offsetWidth !== 0) {
          document.querySelector(fecharJanelaAjuda).click();
        }
      }
    }, irpfSelectors);

    await page.goto(irpfDecUrl(anoConsulta), { waitUntil: 'networkidle0' });

    const decStatus = await page.evaluate(
      ({ table }) => document.querySelector(table).children[1].children[5].innerText,
      decSelectors,
    );

    await page.evaluate(
      ({ extratoLink }) => document.querySelector(extratoLink).click(),
      decSelectors,
    );

    await page.waitForSelector('.notLoading');

    await page.pdf({ path: `${folder}/${contribInfos.nome} - ${contribInfos.cpf}.pdf`, format: 'A4' });

    await browser.close();

    return decStatus;
  } catch (err) {
    await browser.close();
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
    const [nome, cpf, codigoAcesso, senha] = linha.split(',');
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

async function main() {
  checkFolder(folder);
  const pessoas = extractFileData(filePath);
  const pessoasSeparadas = [];

  let threadCounter = 0;
  for (let count = 0; count < pessoas.length; count += 1) {
    const pessoa = pessoas[count];
    if (!Array.isArray(pessoasSeparadas[threadCounter])) {
      pessoasSeparadas[threadCounter] = [];
    }

    pessoasSeparadas[threadCounter].push(pessoa);

    threadCounter += 1;

    if (threadCounter >= threadsMax) threadCounter = 0;
  }

  const resultArr = (await Promise.all(
    pessoasSeparadas.map(async (data, threadNum) => {
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
    }),
  )).flat();

  saveData(resultArr);
  console.log('end');
}


main();
