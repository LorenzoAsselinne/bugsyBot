//https://discordjs.guide/creating-your-bot/event-handling.html#individual-event-files
const { Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);


    const GENERAL_CHANNEL_ID = '1423020095978082465';

    try {
      const channel = await client.channels.fetch(GENERAL_CHANNEL_ID);
      if (channel) {
        await channel.send('🤖 Bugsy est de retour ! Prêt à répondre à vos questions (ou à râler un peu).');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message de démarrage:', error);
    }
  },
};