import { getCollection } from "@/utils/functions";
import { sendBadRequest, sendMethodNotAllowed, sendOk } from "@/utils/apiMethods";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const collection = await getCollection("comments");
  const postsCollection = await getCollection("posts");

  // POST - adăugare comentariu
  if (req.method === "POST") {
    const { postId, commentatorId, text } = req.body;

    if (!postId || !commentatorId || !text?.trim()) {
      return sendBadRequest(res, "Missing required fields.");
    }

    const comment = {
      commentatorId: new ObjectId(commentatorId),
      text: text.trim(),
      commentDate: new Date(),
    };

    const result = await collection.insertOne(comment);

    await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $push: { comments: result.insertedId } }
    );

    return sendOk(res, { insertedId: result.insertedId });
  }

  // GET - obținere comentarii după listă de ID-uri
  if (req.method === "GET") {
    const { ids } = req.query;

    if (!ids) return sendBadRequest(res, "Missing ids");

    let parsedIds;
    try {
      parsedIds = JSON.parse(ids);
    } catch (e) {
      return sendBadRequest(res, "Invalid ids format. Must be a JSON array.");
    }

    const objectIds = parsedIds.map((id) => new ObjectId(id));
    const comments = await collection.find({ _id: { $in: objectIds } }).toArray();

    return sendOk(res, { data: comments });
  }

  return sendMethodNotAllowed(res);
}
