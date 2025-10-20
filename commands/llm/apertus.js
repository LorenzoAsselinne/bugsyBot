const { SlashCommandBuilder } = require("discord.js");
const { queryApertus } = require("../../apertus");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("apertus")
    .setDescription("Parle avec mon intégration pétée de llm")
    .addStringOption(option =>
      option.setName("prompt")
        .setDescription("Ce que tu veux demander au modèle")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply(); // évite les timeouts

    const prompt = interaction.options.getString("prompt");

    try {
      const result = await queryApertus(prompt);
      await interaction.editReply(`Demande : ${prompt}\n` + `\nréponse : ${result}`);
    } catch (err) {
      await interaction.editReply("❌ Erreur lors de l'appel à l'API PublicAI.");
    }
  }
};
