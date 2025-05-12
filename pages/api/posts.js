import { getCollection } from "@/utils/functions";
import { sendOk, sendBadRequest, sendMethodNotAllowed } from "@/utils/apiMethods";

const COLLECTION_NAME = "posts";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const post = req.body;
    if (!post.description || !post.images?.length || !post.authorName || !post.authorId) {
        return sendBadRequest(res, "Missing required fields.");
    }

    const collection = await getCollection(COLLECTION_NAME);
    const result = await collection.insertOne(post);
    return sendOk(res, result);
  }

  return sendMethodNotAllowed(res);
}