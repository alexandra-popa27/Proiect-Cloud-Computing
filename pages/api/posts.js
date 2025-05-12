import { getCollection } from "@/utils/functions";
import { sendOk, sendBadRequest, sendMethodNotAllowed } from "@/utils/apiMethods";
import { ObjectId } from "mongodb";

const COLLECTION_NAME = "posts";

export default async function handler(req, res) {
    
    const collection = await getCollection(COLLECTION_NAME);
    
    if (req.method === "POST") {
      const post = req.body;
  
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

    if (req.method === "GET") {
        const { id } = req.query;
    
        if (id) {
          try {
            const post = await collection.findOne({ _id: new ObjectId(id) });
            if (!post) return sendBadRequest(res, "Post not found.");
            return sendOk(res, { data: post });
          } catch (error) {
            return sendBadRequest(res, "Invalid post ID format.");
          }
        } else {
          const posts = await collection.find().toArray();
          return sendOk(res, { data: posts });
        }
      }

    if (req.method === "DELETE") {
        const { id } = req.query;
        if (!id) return sendBadRequest(res, "Missing post ID.");
      
        const collection = await getCollection(COLLECTION_NAME);
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
      
        return sendOk(res, { deletedCount: result.deletedCount });
    }


  
    return sendMethodNotAllowed(res);
  }