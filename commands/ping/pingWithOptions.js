//https://discordjs.guide/slash-commands/advanced-creation.html#adding-options

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('optiontest')
    .setDescription('Tu vas bien ?')
    .addStringOption(option =>
      option.setName('input')
        .setDescription('gépadinsspi')
        .addChoices(
          { name: 'oui', value: 'Cool, Osef' },
          { name: 'non', value: 'Dur, Osef' },
          { name: 'peut-être', value: 'C\'est une question simple pourtant' },
        )),

  async execute(interaction) {
    const input = interaction.options?.getString('input');
    await interaction.reply(`${input ? input : 'tu as oublié de répondre'}`);
  }
}