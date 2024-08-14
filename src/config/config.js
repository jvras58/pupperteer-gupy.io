require('dotenv').config();

module.exports = {
    discordToken: process.env.DISCORD_TOKEN,
    discordChannelId: process.env.DISCORD_CHANNEL_ID,
    searchTerm: process.env.SEARCH,
    port: process.env.PORT || 3005
};
