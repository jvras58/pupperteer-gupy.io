const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const COOKIES_PATH = path.resolve(__dirname, '../../cookies.json');

async function searchVaga({ termoDeBusca } = {}) {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        if (fs.existsSync(COOKIES_PATH)) {
            const cookiesString = fs.readFileSync(COOKIES_PATH, 'utf-8');
            const cookies = JSON.parse(cookiesString);
            await page.setCookie(...cookies);
        }

        const url = `https://portal.gupy.io/job-search/term=${encodeURIComponent(termoDeBusca)}`;
        await page.goto(url, { waitUntil: 'networkidle2' });

        const resultados = await page.evaluate(() => {
            const vagasElementos = document.querySelectorAll('ul.sc-a01de6b-0 li');
            const listaVagas = [];

            vagasElementos.forEach(vaga => {
                const titulo = vaga.querySelector('h3.sc-bZkfAO')?.innerText || 'Título não encontrado';
                const empresa = vaga.querySelector('p.sc-bBXxYQ')?.innerText || 'Empresa não encontrada';
                const local = vaga.querySelector('span[data-testid="job-location"]')?.innerText || 'Localização não encontrada';
                const tipoContrato = Array.from(vaga.querySelectorAll('div[role="group"]')).find(div => div.getAttribute('aria-label')?.startsWith('Essa vaga é do tipo'))?.querySelector('span').innerText || 'Vaga tipo não encontrado';
                const modeloTrabalho = Array.from(vaga.querySelectorAll('div[role="group"]')).find(div => div.getAttribute('aria-label')?.startsWith('Modelo de trabalho'))?.querySelector('span').innerText || 'Modelo de trabalho não encontrado';
                const dataPublicacao = vaga.querySelector('p.sc-d9e69618-0')?.innerText.replace('Publicada em: ', '') || 'Data de publicação não encontrada';
                const link = vaga.querySelector('a')?.href || 'Link não encontrado';

                listaVagas.push({ titulo, empresa, local, tipoContrato, modeloTrabalho, dataPublicacao, link });
            });

            return listaVagas;
        });

        await browser.close();
        return resultados;
    } catch (error) {
        console.error('Erro durante a automação:', error);
        if (browser) await browser.close();
        return [];
    }
}

module.exports = { searchVaga };
