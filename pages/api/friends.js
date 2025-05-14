import { getCollection } from "@/utils/functions";
import { sendOk, sendBadRequest, sendMethodNotAllowed } from "@/utils/apiMethods";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const collection = await getCollection("friendRequests");
  const usersCollection = await getCollection("users");

  if (req.method === "POST") {
    const { requesterId, receiverId } = req.body;
    if (!requesterId || !receiverId) return sendBadRequest(res, "Missing fields");

    const existing = await collection.findOne({
      requesterId: new ObjectId(requesterId),
      receiverId: new ObjectId(receiverId),
    });

    if (existing) return sendOk(res, { message: "Already sent" });

    await collection.insertOne({
      requesterId: new ObjectId(requesterId),
      receiverId: new ObjectId(receiverId),
      status: "sent",
      createdAt: new Date(),
    });

    return sendOk(res, { success: true });
  }

  if (req.method === "GET") {
    const { requesterId, receiverId } = req.query;
  
    if (requesterId && receiverId) {
      const existing = await collection.findOne({
        requesterId: new ObjectId(requesterId),
        receiverId: new ObjectId(receiverId),
      });
  
      if (!existing) return sendOk(res, null);
      return sendOk(res, existing);
    }
  
    if (receiverId) {
      const requests = await collection
        .find({ receiverId: new ObjectId(receiverId), status: "sent" })
        .toArray();
  
      return sendOk(res, requests);
    }
  
    return sendBadRequest(res, "Missing parameters.");
  }

  if (req.method === "PUT") {
    const { requestId } = req.body;
    if (!requestId) return sendBadRequest(res, "Missing requestId");

    const request = await collection.findOne({ _id: new ObjectId(requestId) });
    if (!request) return sendBadRequest(res, "Request not found");

    await collection.updateOne({ _id: new ObjectId(requestId) }, { $set: { status: "accepted" } });

    // Add each other as friends
    const requesterId = request.requesterId;
    const receiverId = request.receiverId;

    await usersCollection.updateOne(
      { _id: receiverId },
      { $addToSet: { friends: requesterId } }
    );

    await usersCollection.updateOne(
      { _id: requesterId },
      { $addToSet: { friends: receiverId } }
    );

    return sendOk(res, { success: true });
  }

  return sendMethodNotAllowed(res);
}