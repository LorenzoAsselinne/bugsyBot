const axios = require("axios");

async function queryApertus(prompt) {
  try {
    const response = await axios.post(
      "https://api.publicai.co/v1/chat/completions",
      {
        model: "swiss-ai/apertus-8b-instruct",
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 512,
        temperature: 0.8,
        top_p: 0.9
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.IAPI}`,
          "Content-Type": "application/json",
          "User-Agent": "BugsyBot/1.0"
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Erreur API PublicAI:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = { queryApertus };
