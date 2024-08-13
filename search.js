require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const COOKIES_PATH = path.resolve(__dirname, 'cookies.json');

async function searchVaga({ termoDeBusca } = {}) {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Carregar cookies se existirem
        const previousSession = fs.existsSync(COOKIES_PATH);
        if (previousSession) {
            const cookiesString = fs.readFileSync(COOKIES_PATH, 'utf-8');
            const cookies = JSON.parse(cookiesString);
            await page.setCookie(...cookies);
        }

        // Construir a URL com o termo de busca
        const url = `https://portal.gupy.io/job-search/term=${encodeURIComponent(termoDeBusca)}`;

        // Acessa a página de resultados de busca com o termo
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Extração dos resultados da busca
        const resultados = await page.evaluate(() => {
            // Encontre todos os elementos de lista de vagas
            const vagasElementos = document.querySelectorAll('ul.sc-a01de6b-0 li');
            const listaVagas = [];

            vagasElementos.forEach(vaga => {
                // Extrair o título da vaga
                const titulo = vaga.querySelector('h3.sc-bZkfAO') ? vaga.querySelector('h3.sc-bZkfAO').innerText : 'Título não encontrado';

                // Extrair a empresa
                const empresa = vaga.querySelector('p.sc-bBXxYQ') ? vaga.querySelector('p.sc-bBXxYQ').innerText : 'Empresa não encontrada';

                // Extrair a localização
                const local = vaga.querySelector('span[data-testid="job-location"]') ? vaga.querySelector('span[data-testid="job-location"]').innerText : 'Localização não encontrada';

                // Extrair o tipo de contrato
                const tipoContratoDiv = Array.from(vaga.querySelectorAll('div[role="group"]')).find(
                    div => div.getAttribute('aria-label')?.startsWith('Essa vaga é do tipo')
                );
                const tipoContrato = tipoContratoDiv ? tipoContratoDiv.querySelector('span').innerText : 'Vaga tipo não encontrado';

                // Extrair o tipo de trabalho
                const modeloTrabalhoDiv = Array.from(vaga.querySelectorAll('div[role="group"]')).find(
                    div => div.getAttribute('aria-label')?.startsWith('Modelo de trabalho')
                );
                const modeloTrabalho = modeloTrabalhoDiv ? modeloTrabalhoDiv.querySelector('span').innerText : 'Modelo de trabalho não encontrado';

                // Extrair a data de publicação
                const dataPublicacao = vaga.querySelector('p.sc-d9e69618-0') ? vaga.querySelector('p.sc-d9e69618-0').innerText.replace('Publicada em: ', '') : 'Data de publicação não encontrada';

                // Link da vaga
                const link = vaga.querySelector('a') ? vaga.querySelector('a').href : 'Link não encontrado';

                listaVagas.push({ titulo, empresa, local, tipoContrato, modeloTrabalho, dataPublicacao, link });
            });

            return listaVagas;
        });


        // Fecha o navegador
        await browser.close();

        return resultados;

    } catch (error) {
        console.error('Erro durante a automação:', error);
        if (browser) {
            await browser.close();
        }
        // Retorna um array vazio em caso de erro para evitar undefined
        return [];
    }
}

module.exports = searchVaga;
