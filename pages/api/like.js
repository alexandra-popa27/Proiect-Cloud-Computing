// pages/api/like.js
import { getCollection } from "@/utils/functions";
import { ObjectId } from "mongodb";
import { sendOk, sendBadRequest, sendMethodNotAllowed } from "@/utils/apiMethods";

export default async function handler(req, res) {
  if (!["PUT", "DELETE"].includes(req.method)) {
    return sendMethodNotAllowed(res);
  }

  const { id } = req.query;
  const { userId } = req.body;

  if (!id || !userId) return sendBadRequest(res, "Missing post ID or user ID.");

  const collection = await getCollection("posts");

  try {
    const update = req.method === "PUT"
      ? { $addToSet: { likes: new ObjectId(userId) } }
      : { $pull: { likes: new ObjectId(userId) } };

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      update
    );

    return sendOk(res, { updated: result.modifiedCount === 1 });
  } catch (err) {
    console.error("Error updating like:", err);
    return sendBadRequest(res, "Failed to update likes.");
  }
}
