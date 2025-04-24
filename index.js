const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Clave segura desde variables de entorno
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  // 🐞 LOG PARA DEBUG
  console.log("🔑 API Key presente:", !!OPENAI_API_KEY);
  console.log("📩 Mensaje recibido:", userMessage);

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
    console.log("✅ Respuesta de OpenAI:", gptResponse); // 👀 LOG DE RESPUESTA

    res.status(200).send({ reply: gptResponse });
  } catch (error) {
    // 🐞 LOG DETALLADO DE ERROR
    console.error("❌ Error al llamar a OpenAI:", error.response?.data || error.message);
    res.status(500).send({ error: "Error al procesar tu mensaje." });
  }
});

app.get("/", (req, res) => {
  res.send("Servidor Operamental activo 🚀");
});

app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${port}`);
});
