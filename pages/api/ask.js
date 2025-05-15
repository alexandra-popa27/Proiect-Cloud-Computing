import { getCollection } from "@/utils/functions";
import { ObjectId } from "mongodb";
import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question, userId } = req.body;

  if (!question || !userId) {
    return res.status(400).json({ error: "Missing question or userId" });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: question }],
    });

    const answer = completion.data.choices[0].message.content;
    const collection = await getCollection("historyAI");

    await collection.insertOne({
      userId: new ObjectId(userId),
      question,
      answer,
      createdAt: new Date(),
    });

    return res.status(200).json({ response: answer });
  } catch (err) {
    console.error("OpenAI response error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to get response from OpenAI" });
  }
}

