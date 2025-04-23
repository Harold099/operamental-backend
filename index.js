const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({ origin: true });

const OPENAI_API_KEY = "TU_API_KEY_AQUI"; // ← Reemplaza esto con tu API key real de OpenAI

exports.chatWithGPT = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send({ error: "Método no permitido" });
    }

    const userMessage = req.body.message;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: userMessage }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const gptResponse = response.data.choices[0].message.content;
      return res.status(200).send({ reply: gptResponse });
    } catch (error) {
      console.error("Error al llamar a OpenAI:", error.response?.data || error.message);
      return res.status(500).send({ error: "Error al procesar tu mensaje." });
    }
  });
});
