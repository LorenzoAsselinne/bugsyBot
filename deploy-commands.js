//https://discordjs.guide/creating-your-bot/command-deployment.html#command-registration
// deploy-commands.js
require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const token = process.env.DISCORD_TOKEN;
console.log('🔎 ➡️ - deploy-commands.js: token:', token);
const guildId = process.env.GUILD_ID;
const clientId = process.env.CLIENT_ID;

const commands = [];

// Chemin vers le dossier parent des commandes
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// Parcours tous les sous-dossiers
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  // Vérifie que c'est bien un dossier (évite erreurs si un fichier traîne dans commands)
  if (!fs.lstatSync(commandsPath).isDirectory()) continue;

  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(`[WARNING] La commande ${file} est manquante "data" ou "execute"`);
    }
  }
}

// Initialisation du REST client
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log(`Mise à jour de ${commands.length} commandes slash sur la guilde...`);
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );
    console.log('Commandes mises à jour !');
  } catch (error) {
    console.error(error);
  }
})();

