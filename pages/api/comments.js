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
    console.log("GET /api/comments - Raw ids param:", ids);

    if (!ids) return sendBadRequest(res, "Missing ids");

    let parsedIds;
    try {
      parsedIds = JSON.parse(ids);
      console.log("Parsed comment IDs:", parsedIds);
      if (!Array.isArray(parsedIds)) throw new Error("IDs is not an array.");
    } catch (e) {
      console.error("Failed to parse ids:", e.message);
      return sendBadRequest(res, "Invalid ids format. Must be a JSON array.");
    }

    const objectIds = parsedIds.map((id) => new ObjectId(id));
    console.log("Converted to ObjectIds:", objectIds);

    const comments = await collection.find({ _id: { $in: objectIds } }).toArray();
    console.log("Fetched comments from DB:", comments);

    return sendOk(res, { data: comments });
  }

  return sendMethodNotAllowed(res);
}
