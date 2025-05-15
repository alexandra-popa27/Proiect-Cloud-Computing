import { getCollection } from "@/utils/functions";
import { sendBadRequest, sendOk, sendMethodNotAllowed } from "@/utils/apiMethods";

export default async function handler(req, res) {
  const collection = await getCollection("historyAI");

  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return sendBadRequest(res, "Missing userId");
    }

    const data = await collection.find({ userId }).sort({ createdAt: 1 }).toArray();
    return sendOk(res, { data });
  }

  return sendMethodNotAllowed(res);
}
