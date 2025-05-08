import { getCollection } from "@/utils/functions";
import { sendOk, sendBadRequest, sendMethodNotAllowed } from "@/utils/apiMethods";

const COLLECTION_NAME = "users";

export default async function handler(req, res) {
  const collection = await getCollection(COLLECTION_NAME);

  if (req.method === "GET") {
    const chefCandidates = await collection.find({ checkChef: true }).toArray();
    return sendOk(res, chefCandidates);
  }

  if (req.method === "PUT") {
    const { email } = req.body;
    if (!email) return sendBadRequest(res, "Email is required.");

    const updated = await collection.findOneAndUpdate(
      { email },
      { $set: { role: "chef", checkChef: false } },
      { returnDocument: "after" }
    );

    if (!updated.value) return sendBadRequest(res, "User not found.");
    return sendOk(res, updated.value);
  }

  return sendMethodNotAllowed(res);
}