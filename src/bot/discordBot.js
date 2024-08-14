const { Client, GatewayIntentBits } = require('discord.js');
const { discordToken } = require('../config/config');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`Logado como ${client.user.tag}!`);
});

async function sendDiscordMessage(channelId, message) {
    try {
        const channel = await client.channels.fetch(channelId);
        if (channel) {
            await channel.send(message);
        }
    } catch (error) {
        console.error('Erro ao enviar mensagem para o Discord:', error);
    }
}

async function prepareDiscordMessages(results) {
    const maxLength = 2000;
    const header = 'Aqui estão os resultados da pesquisa:\n\n';
    const messageParts = [];
    let currentMessage = header;

    for (const result of results) {
        const text = `**Título:** [${result.titulo}](<${result.link}>)\n**Empresa:** ${result.empresa}\n**Localização:** ${result.local}\n**Modelo de Trabalho:** ${result.modeloTrabalho}\n**Tipo de Contrato:** ${result.tipoContrato}\n**Publicado em:** ${result.dataPublicacao}\n\n`;

        if (currentMessage.length + text.length > maxLength) {
            messageParts.push(currentMessage);
            currentMessage = header + text;
        } else {
            currentMessage += text;
        }
    }

    if (currentMessage.trim().length > header.length) {
        messageParts.push(currentMessage);
    }

    return messageParts;
}

client.login(discordToken);

module.exports = { sendDiscordMessage, prepareDiscordMessages };
