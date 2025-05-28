import { getCollection } from "@/utils/functions";
import {
  sendBadRequest,
  sendMethodNotAllowed,
  sendOk
} from "@/utils/apiMethods";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const collection = await getCollection("reviews");

  if (req.method === "POST") {
    const { restaurantName, lat, lng, reviewerId, score, comment } = req.body;

    if (!restaurantName || !reviewerId || !score || !comment) {
      return sendBadRequest(res, "Missing required fields.");
    }

    const review = {
      restaurantName,
      lat,
      lng,
      reviewerId: new ObjectId(reviewerId),
      score,
      comment,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(review);
    return sendOk(res, { insertedId: result.insertedId });
  }

  if (req.method === "GET") {
    const reviews = await collection.find({}).toArray();
    return sendOk(res, reviews);
  }

  return sendMethodNotAllowed(res);
}
