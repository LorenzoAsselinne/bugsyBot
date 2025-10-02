// bot/commands/ping.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('WIP'),
  async execute(interaction) {
    const user = interaction.user; // l'utilisateur qui a tapé la commande
    const hour = new Date().getHours();

    let greeting;

    if (hour >= 5 && hour < 12) {
      greeting = `Salut ${user} ! Je te souhaite une bonne matinée 🌅. Pong! 🏓`;
    } else if (hour >= 12 && hour < 18) {
      greeting = `Salut ${user} ! Passe une belle après-midi 🌤️. Pong! 🏓`;
    } else if (hour >= 18 && hour < 22) {
      greeting = `Salut ${user} ! Bonne soirée 🌇. Pong! 🏓`;
    } else {
      greeting = `Salut ${user} ! Bonne nuit 🌙. Pong! 🏓`;
    }

    await interaction.reply(greeting);
  }
}