import { getCollection } from "@/utils/functions";
import { sendOk, sendBadRequest, sendMethodNotAllowed } from "@/utils/apiMethods";

const COLLECTION_NAME = "users";

const getChefRequests = async () => {
  const collection = await getCollection(COLLECTION_NAME);
  return collection.find({ checkChef: true }).toArray();
};

const promoteUser = async (email) => {
  const collection = await getCollection(COLLECTION_NAME);
  return collection.findOneAndUpdate(
    { email },
    { $set: { role: "chef", checkChef: false } },
    { returnDocument: "after" }
  );
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    const users = await getChefRequests();
    return sendOk(res, users);
  }

  if (req.method === "PUT") {
    const { email } = req.body;
    if (!email) return sendBadRequest(res, "Email is required.");

    const result = await promoteUser(email);
    if (!result?.value) return sendBadRequest(res, "User not found.");

    return sendOk(res, result.value);
  }

  return sendMethodNotAllowed(res);
}