const express = require('express');
const { searchVaga } = require('../services/jobSearchService');
const { sendDiscordMessage, prepareDiscordMessages } = require('../bot/discordBot');
const { searchTerm, discordChannelId } = require('../config/config');

const router = express.Router();

router.get('/pesquisar', async (req, res) => {
    console.log('Rodando a pesquisa de vagas');
    try {
        const resultados = await searchVaga({ termoDeBusca: req.query.term || searchTerm });

        if (Array.isArray(resultados) && resultados.length > 0) {
            const messages = await prepareDiscordMessages(resultados);
            for (const message of messages) {
                await sendDiscordMessage(discordChannelId, message);
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

module.exports = router;
