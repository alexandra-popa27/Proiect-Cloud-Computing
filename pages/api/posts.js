import { getCollection } from "@/utils/functions";
import { sendOk, sendBadRequest, sendMethodNotAllowed } from "@/utils/apiMethods";
import { ObjectId } from "mongodb";

const COLLECTION_NAME = "posts";

export default async function handler(req, res) {
    
    const collection = await getCollection(COLLECTION_NAME);
    console.log("req.query:", req.query);
    
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
            console.log("GET /api/posts with id:", id); 
          try {
            const post = await collection.findOne({ _id: new ObjectId(id) });
            console.log("Found post:", post);
            if (!post) return sendBadRequest(res, "Post not found.");
            return sendOk(res, { data: post });
          } catch (error) {
            console.error("Invalid post ID format or fetch error:", error);
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

    if (req.method === "PUT") {
      const { id } = req.query;
      const { commentId } = req.body;
    
      if (!id || !commentId) return sendBadRequest(res, "Missing post ID or comment ID.");
    
      try {
        const result = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $addToSet: { comments: new ObjectId(commentId) } } 
        );
    
        return sendOk(res, { updated: result.modifiedCount === 1 });
      } catch (error) {
        console.error("Error updating post with comment ID:", error);
        return sendBadRequest(res, "Failed to update post with comment ID.");
      }
    }

    return sendMethodNotAllowed(res);
  }