const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('2ping')
    .setDescription('test réponse éditables'),
  async execute(interaction) {
    try {

      if (interaction.commandName === '2ping') {
        await interaction.reply('Premier Pong');
        await wait(2_000);
        await interaction.editReply('deuxième pong !');
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Erreur lors de l’exécution de la commande !', ephemeral: true });
    }
  }

}