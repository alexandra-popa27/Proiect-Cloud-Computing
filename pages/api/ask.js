// pages/api/ask.js
export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { question } = req.body;
  
    if (!question) {
      return res.status(400).json({ error: "Missing question" });
    }
  
    try {
      const ollamaRes = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistral",
          prompt: question,
          stream: false
        })
      });
  
      const data = await ollamaRes.json();
      return res.status(200).json({ response: data.response });
    } catch (err) {
      console.error("Error from Ollama:", err);
      return res.status(500).json({ error: "Failed to connect to Ollama" });
    }
  }
  