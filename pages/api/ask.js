// pages/api/ask.js
import { getCollection } from "@/utils/functions";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question, userId } = req.body;

  if (!question || !userId) {
    return res.status(400).json({ error: "Missing question or userId" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are CookAId, an expert cooking assistant. Answer cooking-related questions clearly and helpfully.",
          },
          {
            role: "user",
            content: question,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await openaiRes.json();

    if (data.choices && data.choices.length > 0) {
      const answer = data.choices[0].message.content;

      // salvează în MongoDB
      const collection = await getCollection("historyAI");
      await collection.insertOne({
        userId: new ObjectId(userId),
        question,
        answer,
        createdAt: new Date(),
      });

      return res.status(200).json({ response: answer });
    } else {
      console.error("OpenAI response error:", data);
      return res.status(500).json({ error: "Invalid response from OpenAI" });
    }
  } catch (err) {
    console.error("Error communicating with OpenAI:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
