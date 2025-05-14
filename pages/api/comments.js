import { getCollection } from "@/utils/functions";
import { sendBadRequest, sendMethodNotAllowed, sendOk } from "@/utils/apiMethods";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const collection = await getCollection("comments");
  const postsCollection = await getCollection("posts");

  if (req.method === "POST") {
    const { postId, commentatorId, text } = req.body;

    console.log("POST /api/comments - Body:", req.body);

    if (!postId || !commentatorId || !text?.trim()) {
      return sendBadRequest(res, "Missing required fields.");
    }

    const comment = {
      commentatorId: new ObjectId(commentatorId),
      text,
      commentDate: new Date(),
    };

    const result = await collection.insertOne(comment);

    await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $push: { comments: result.insertedId } }
    );

    return sendOk(res, { insertedId: result.insertedId });
  }

  if (req.method === "GET") {
    const { ids } = req.query;
  
    console.log("GET /api/comments - ids param:", ids);
  
    if (!ids || (Array.isArray(ids) && ids.length === 0)) {
      return sendBadRequest(res, "Missing ids");
    }
  
    const idsArray = Array.isArray(ids) ? ids : [ids];
  
    const objectIds = idsArray.map((id) => new ObjectId(id));
    const comments = await collection.find({ _id: { $in: objectIds } }).toArray();
  
    return sendOk(res, { data: comments });
  }

  return sendMethodNotAllowed(res);
}
