import { getCollection } from "@/utils/functions";
import { sendOk, sendBadRequest, sendMethodNotAllowed } from "@/utils/apiMethods";
import { ObjectId } from "mongodb";

const COLLECTION_NAME = "posts";

export default async function handler(req, res) {
    if (req.method === "POST") {
      const post = req.body;
  
      // Validare inițială
      if (!post.description || !post.images?.length || !post.authorId) {
        return sendBadRequest(res, "Missing required fields.");
      }
  
      try {
        post.authorId = new ObjectId(post.authorId);
      } catch (err) {
        return sendBadRequest(res, "Invalid authorId format.");
      }
  
      const collection = await getCollection(COLLECTION_NAME);
      const result = await collection.insertOne(post);
      return sendOk(res, result);
    }
  
    return sendMethodNotAllowed(res);
  }