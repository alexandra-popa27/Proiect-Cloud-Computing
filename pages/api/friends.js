import { getCollection } from "@/utils/functions";
import { sendOk, sendBadRequest, sendMethodNotAllowed } from "@/utils/apiMethods";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const collection = await getCollection("friendRequests");

  if (req.method === "POST") {
    const { requesterId, receiverId } = req.body;

    if (!requesterId || !receiverId) {
      return sendBadRequest(res, "Missing requester or receiver ID");
    }

    // Verificăm dacă există deja o cerere
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

  return sendMethodNotAllowed(res);
}