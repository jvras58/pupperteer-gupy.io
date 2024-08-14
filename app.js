const express = require('express');
const morgan = require('morgan');
const jobRoutes = require('./src/routes/jobRoutes');
const cron = require('node-cron');
const { searchVaga } = require('./src/services/jobSearchService');
const { sendDiscordMessage, prepareDiscordMessages } = require('./src/bot/discordBot');
const { searchTerm, discordChannelId } = require('./src/config/config');

const app = express();


app.use(morgan('combined'));


app.use('/jobs', jobRoutes);


app.get('/', (req, res) => {
    res.send('Bem-vindo ao Gupy Job Search Bot!');
});

// Cron job para executar a pesquisa diariamente às 9h
cron.schedule('0 9 * * *', async () => {
    console.log('Executando pesquisa de vagas agendada');
    try {
        const results = await searchVaga({ termoDeBusca: searchTerm });

        if (Array.isArray(results) && results.length > 0) {
            const messages = await prepareDiscordMessages(results);
            for (const message of messages) {
                await sendDiscordMessage(discordChannelId, message);
            }
        }
    } catch (error) {
        console.error('Ocorreu um erro durante a pesquisa agendada:', error);
    }
});

module.exports = app;