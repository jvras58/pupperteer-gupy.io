const express = require('express');
const cron = require('node-cron');
const searchVaga = require('./search'); 
const { sendDiscordMessage, prepareDiscordMessages } = require('./discordBot');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3005;

// Middleware para logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

app.get('/', (req, res) => {
    res.send('O bot de pesquisa está em execução');
});

app.get('/pesquisar', async (req, res) => {
    console.log('Rodando a pesquisa de vagas');
    try {
        const resultados = await searchVaga({
            termoDeBusca: req.query.term || process.env.SEARCH
        });
        
        // Verifique se resultados é um array e possui itens
        if (Array.isArray(resultados) && resultados.length > 0) {
            const messages = await prepareDiscordMessages(resultados);
            for (const message of messages) {
                await sendDiscordMessage(DISCORD_CHANNEL_ID, message);
            }
            res.send('Pesquisa concluída e resultados enviados para Discord.');
        } else {
            res.send('Nenhum novo resultado de trabalho encontrado.');
        }
    } catch (error) {
        console.error('Erro durante a pesquisa de vagas:', error);
        res.status(500).send('Ocorreu um erro durante a pesquisa.');
    }
});

// Agendar a pesquisa diária às 9h
cron.schedule('0 9 * * *', async () => {
    console.log('Executando pesquisa de vagas agendada');
    try {
        const results = await searchVaga({ termoDeBusca: process.env.SEARCH });

        // Verifique se resultados é um array e possui itens
        if (Array.isArray(results) && results.length > 0) {
            const messages = prepareDiscordMessages(results);
            for (const message of messages) {
                await sendDiscordMessage(DISCORD_CHANNEL_ID, message);
            }
        }
    } catch (error) {
        console.error('Ocorreu um erro durante a pesquisa agendada:', error);
    }
});

// Inicia o servidor Express na porta especificada
app.listen(port, () => {
    console.log(`O servidor está em execução: http://localhost:${port}`);
});

