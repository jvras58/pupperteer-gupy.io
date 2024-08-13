const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`logado como ${client.user.tag}!`);
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

client.login(process.env.DISCORD_TOKEN);

// Função para dividir as mensagens em partes menores
async function prepareDiscordMessages(results) {
    const maxx = 2000; // Limite de 2000 caracteres por mensagem
    const titulo = 'Aqui estão os resultados da pesquisa:\n\n';
    const mensagemParts = [];
    let currentmensagem = titulo;

    for (const result of results) {
        const texto = `**Título:** [${result.titulo}](<${result.link}>)\n**Empresa:** ${result.empresa}\n**Localização:** ${result.local}\n**Modelo de Trabalho:** ${result.modeloTrabalho}\n**Tipo de Contrato:** ${result.tipoContrato}\n**Publicado em:** ${result.dataPublicacao}\n\n`;

        if (currentmensagem.length + texto.length > maxx) {
            mensagemParts.push(currentmensagem);
            currentmensagem = titulo + texto;
        } else {
            currentmensagem += texto;
        }
    }

    // Adiciona a última parte, se houver
    if (currentmensagem.trim().length > titulo.length) {
        mensagemParts.push(currentmensagem);
    }

    return mensagemParts;
}

module.exports = { sendDiscordMessage, prepareDiscordMessages };