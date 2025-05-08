import { getCollection } from "@/utils/functions";
import { sendOk, sendBadRequest, sendMethodNotAllowed } from "@/utils/apiMethods";
import { ObjectId } from "mongodb";

const COLLECTION_NAME = "users";

const getChefRequests = async () => {
  const collection = await getCollection(COLLECTION_NAME);
  return collection.find({ checkChef: true }).toArray();
};

const promoteUser = async (id) => {
  const collection = await getCollection(COLLECTION_NAME);
  return collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
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
    const { id } = req.body;
    if (!id) return sendBadRequest(res, "User ID is required.");
    const result = await promoteUser(id);

    return sendOk(res, result.value);
  }

  return sendMethodNotAllowed(res);
}