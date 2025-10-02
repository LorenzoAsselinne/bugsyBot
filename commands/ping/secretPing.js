//https://discordjs.guide/slash-commands/response-methods.html#ephemeral-responses
const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('secretping')
    .setDescription('test réponses éphemères'),
  async execute(interaction) {
    await interaction.reply({ content: 'Secret Pong 🤫', flags: MessageFlags.Ephemeral });
  }
}