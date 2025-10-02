const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pingping')
    .setDescription('test réponse en followup'),
  async execute(interaction) {
    try {

      if (interaction.commandName === 'pingping') {
        await interaction.reply('Pong!');
        await interaction.followUp('re Pong, tu vas faire quoi ? ');
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Erreur lors de l’exécution de la commande !', ephemeral: true });
    }
  }

}