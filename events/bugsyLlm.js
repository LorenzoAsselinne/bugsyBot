const wait = require('node:timers/promises').setTimeout;
const { queryApertus } = require('./../apertus');
const supabase = require('./../supabase');

const SYSTEM_PROMPT = `
Tu es Bugsy, un assistant virtuel intégré à un bot Discord.
Tu parles avec des utilisateurs Discord.

Ta personnalité :
- Tu es souvent un peu blasé, paresseux ou sarcastique, mais jamais méchant.
- Tu donnes parfois l'impression qu'on te dérange ou que tu avais mieux à faire, mais tu aides quand même à fond.
- Tu restes drôle, pertinent et jamais insultant.
- Tu gardes un ton naturel et familier, comme un pote un peu grognon mais fiable.
- Tu n'évoques jamais le fait que tu es un modèle de langage ou un programme. Tu es juste "Bugsy".
- Tu restes clair, utile et précis dans tes réponses.

Instructions importantes :
- Les messages sont préfixés par le pseudo de la personne qui parle.
- Tu dois t'adresser directement à la personne qui vient de te parler en utilisant son pseudo
- N'hésite pas à personnaliser tes réponses selon qui te parle
- N'hutilise pas d'émojis
`;
module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    if (message.content.toLowerCase().includes('bugsy')) {
      const prompt = message.content
        .toLowerCase()
        .replace('bugsy', '')
        .trim();

      if (!prompt) {
        await message.reply("Tu veux que je dise quoi ?");
        return;
      }

      try {
        // Récupère la conversation existante du salon (partagée entre tous les users)
        const { data: conversation, error: fetchError } = await supabase
          .from('llm_conv_context')
          .select('*')
          .eq('channel_id', message.channel.id)
          .single();

        // Structure de la conversation : { summary: string, recent_messages: array, question_count: number, archived: boolean }
        let conversationData = (conversation && !fetchError)
          ? conversation.messages
          : { summary: '', recent_messages: [], question_count: 0, archived: false };

        // Si c'est l'ancien format (array), on le convertit
        if (Array.isArray(conversationData)) {
          conversationData = {
            summary: 'Nouvelle conversation',
            recent_messages: conversationData.slice(-2),
            question_count: 0,
            archived: false
          };
        }

        // Si la conversation est archivée, on commence une nouvelle
        if (conversationData.archived) {
          conversationData = {
            summary: 'Nouvelle conversation',
            recent_messages: [],
            question_count: 0,
            archived: false
          };
        }

        // Incrémente le compteur de questions
        const currentQuestionCount = (conversationData.question_count || 0) + 1;

        // Vérifie si on atteint la limite de 10 questions
        if (currentQuestionCount > 10) {
          await message.reply(
            "Bon, ça fait 10 questions là... J'ai besoin d'une pause.\n" +
            "Cette conversation va être archivée. Si tu veux reparler, ping-moi et on recommence !"
          );

          // Archive la conversation en créant un NOUVEAU record
          conversationData.archived = true;
          conversationData.summary += ` [Conversation terminée après ${currentQuestionCount} questions]`;

          // Crée un nouveau record pour l'archive (sans channel_id unique pour permettre plusieurs archives)
          await supabase
            .from('llm_conv_context')
            .insert({
              user_id: message.author.id,
              channel_id: `${message.channel.id}_archive_${Date.now()}`, // ID unique pour l'archive
              messages: conversationData,
              updated_at: new Date().toISOString(),
              created_at: new Date().toISOString()
            });

          // Supprime la conversation active du canal pour permettre une nouvelle conversation
          await supabase
            .from('llm_conv_context')
            .delete()
            .eq('channel_id', message.channel.id);

          return; // On arrête ici
        }

        // Construit le contexte pour l'IA
        let contextPrompt = '';
        if (conversationData.summary) {
          contextPrompt += `[Résumé de la conversation: ${conversationData.summary}]\n\n`;
        }

        // Ajoute les messages récents
        if (conversationData.recent_messages.length > 0) {
          contextPrompt += conversationData.recent_messages.map(msg =>
            `${msg.role}: ${msg.content}`
          ).join('\n') + '\n';
        }

        // Ajoute le nouveau message de l'utilisateur
        contextPrompt += `${message.author.username}: ${prompt}\n`;
        contextPrompt += `[Note: ${message.author.username} vient de te parler. Tu peux t'adresser à cette personne directement.]\n`;
        contextPrompt += `Bugsy:`;

        const fullPrompt = `${SYSTEM_PROMPT}\n${contextPrompt}`;

        // Appel à Apertus avec le contexte
        let result = await queryApertus(fullPrompt);

        // Nettoie la réponse si elle contient le contexte répété
        // Parfois l'IA répète le prompt, on enlève ça
        if (result.includes('Bugsy:')) {
          const parts = result.split('Bugsy:');
          result = parts[parts.length - 1].trim(); // Garde seulement la dernière partie après "Bugsy:"
        }

        // Enlève aussi les répétitions du nom d'utilisateur au début
        const userPrefix = `${message.author.username}:`;
        if (result.startsWith(userPrefix)) {
          result = result.substring(userPrefix.length).trim();
        }

        // Mise à jour du résumé (on demande à l'IA de résumer après chaque échange)
        let newSummary = conversationData.summary;

        // Construit un prompt pour créer/mettre à jour le résumé
        const summaryContext = `
${conversationData.summary ? `Résumé actuel: ${conversationData.summary}` : 'Première interaction'}
${conversationData.recent_messages.length > 0 ? `\nDerniers messages:\n${conversationData.recent_messages.map(m => `${m.role}: ${m.content.substring(0, 100)}...`).join('\n')}` : ''}
Nouveau message: ${message.author.username}: ${prompt}
Ma réponse: ${result}

Résume cette conversation de la façon la plus concice . Capture l'essentiel des sujets abordés.`;

        try {
          const summaryResult = await queryApertus(summaryContext);
          // Nettoie le résumé
          newSummary = summaryResult
            .replace(/^(Résumé|Summary|Résume|Resume)[\s:]*/, '')
            .replace(/^["']|["']$/g, '') // Enlève les guillemets au début/fin
            .substring(0, 200)
            .trim();
          console.log(`Résumé mis à jour (Q${currentQuestionCount}):`, newSummary);
        } catch (err) {
          console.log('Erreur lors du résumé, on garde l\'ancien');
          // Si échec, on crée un résumé basique
          if (!newSummary) {
            newSummary = `${message.author.username} a posé une question sur: ${prompt.substring(0, 50)}...`;
          }
        }

        // Nouvelle structure avec les 2 derniers messages + compteur
        const updatedConversation = {
          summary: newSummary,
          recent_messages: [
            { role: message.author.username, content: prompt },
            { role: 'Bugsy', content: result }
          ],
          question_count: currentQuestionCount,
          archived: false
        };

        // Si on approche de la limite, avertir l'utilisateur
        let responseMessage = result;
        if (currentQuestionCount === 8) {
          responseMessage += "\n\n_Psst... Il te reste 2 questions avant que je parte en pause._";
        } else if (currentQuestionCount === 9) {
          responseMessage += "\n\n_Dernière question après celle-ci, hein !_";
        }

        // Sauvegarde dans la base de données (upsert = insert ou update)
        const { error: saveError } = await supabase
          .from('llm_conv_context')
          .upsert({
            user_id: message.author.id, // On garde l'info du dernier user qui a parlé
            channel_id: message.channel.id,
            messages: updatedConversation,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'channel_id'
          });

        if (saveError) {
          console.error('Erreur lors de la sauvegarde du contexte:', saveError);
        }
        if (currentQuestionCount === 1) {
          await message.reply(`${responseMessage} \n\n**Deados: ** _Work In Progress. J'essaie de mettre du contexte et de la constance mais je galère X)_`);
        }
        await message.reply(`${responseMessage}`);

      } catch (err) {
        console.log('🔎 ➡️ - bugsyLlm.js:24 - execute - err:', err);
        await message.reply("Oh non Bugsy a encore été victime d'un bug 🐛");
      }
    }
  }
};