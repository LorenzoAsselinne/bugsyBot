const wait = require('node:timers/promises').setTimeout;

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    const forbiddenWord = [
      /\bc[o0]+n+\b/gi,
      /encu[l1]+[eé][\s!?.]?/gi,
      /\bc[o0]+nn?a+rd+\b/gi,
      /\bc[o0]+nn?a+sse+\b/gi,
      /\bp[eé]d[eé]?[!?.]?\b/gi,
      /\bsal[o0]+p[eé]?\b/gi,
      /\bput[eé]\b/gi,
      /\bfdp\b/gi,
      /\bpd\b/gi,
      /\bencu[l1]+[eé][!?.]?\b/gi,
      /\bmer+d[eé]?\b/gi,
      /\bni+q+u?[eé]?\b/gi,
      /\bp[eé]d[eé]\b/gi,
      /\bgouine+\b/gi,
      /\btafi?o+l[eé]?\b/gi,
      /\bsalaud+\b/gi,
      /\bordur[eé]?\b/gi,
      /\bchienn[eé]?\b/gi,
      /\bbatard+\b/gi,
      /\bgro+gna+sse+\b/gi,
      /\bpou+ffi?a+sse+\b/gi,
      /\btrou+d+u+c+\b/gi,
      /\bbou+gnoul[eé]?\b/gi,
      /\byou+pin+\b/gi,
      /\brat[o0]+n+\b/gi,
      /\bchine+to+q+u?e?\b/gi,
      /\bn[eé]gr[o0]+\b/gi
    ];

    let forbiddenWordFound = null;
    for (const regex of forbiddenWord) {
      const match = message.content.match(regex);
      if (match) {
        forbiddenWordFound = match[0];
        break;
      }
    }

    if (forbiddenWordFound) {
      try {
        await message.delete();
        await message.channel.send(
          `${message.author}, ton message a été supprimé car il contenait un mot interdit: "${forbiddenWordFound}".\n` +
          `C'est vraiment pas poli de dire "${forbiddenWordFound}".\n` +
          `Personne n'à envie de lire le mot "${forbiddenWordFound}".\n` +
          `${forbiddenWordFound} toi même !`
        );
        await wait(3_000);
        await message.channel.send(`Nan j'déconne, on dit ce qu'on veut :\n` +
          `\n` +
          `${message.author} à dit :  ${message.content}`
        );
      } catch (error) {
        console.error('Erreur lors de la suppression du message:', error);
      }
    }
  }
};