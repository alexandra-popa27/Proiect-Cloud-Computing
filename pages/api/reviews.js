import { connectToDatabase } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { restaurantName, lat, lng, reviewerId, score, comment } = req.body;

      if (!restaurantName || !reviewerId || !score || !comment) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      const { db } = await connectToDatabase();
      const result = await db.collection("reviews").insertOne({
        restaurantName,
        lat,
        lng,
        reviewerId,
        score,
        comment,
        createdAt: new Date(),
      });

      return res.status(200).json({ message: "Review added", id: result.insertedId });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
