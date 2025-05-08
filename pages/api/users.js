import { sendOk, sendBadRequest, sendUnauthorized, sendMethodNotAllowed } from "@/utils/apiMethods";
import { getCollection } from "@/utils/functions";
import { hash } from "bcryptjs";

const COLLECTION_NAME = "users";

export default async function handler(req, res) {
  const collection = await getCollection(COLLECTION_NAME);

  if (req.method === "POST") {
    const { name, phone, email, password, confirmPassword, checkChef } = req.body;

    if (!name || !phone || !email || !password || !confirmPassword) {
      return sendBadRequest(res, "All fields are required.");
    }

    if (password !== confirmPassword) {
      return sendBadRequest(res, "Passwords do not match.");
    }

    if (password.length < 6) {
      return sendBadRequest(res, "Password must be at least 6 characters.");
    }

    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return sendUnauthorized(res, "This email is already registered.");
    }

    const hashedPassword = await hash(password, 10);

    const result = await collection.insertOne({
      name,
      phone,
      email,
      password: hashedPassword,
      checkChef: Boolean(checkChef),
      role: "generic",
      profilePicture: "",
      createdAt: new Date(),
    });

    return sendOk(res, { userId: result.insertedId });
  }

  else if (req.method === "PUT") {
    const { name, phone, email, profilePicture } = req.body;
  
    if (!name || !phone || !email) {
      return sendBadRequest(res, "Name, phone, and email are required.");
    }
  
    const existingUser = await collection.findOne({ email });
    if (!existingUser) {
      return sendBadRequest(res, "User not found.");
    }
  
    await collection.updateOne(
      { email },
      { $set: { name, phone, profilePicture } }
    );
  
    const updatedUser = await collection.findOne({ email });
  
    return sendOk(res, updatedUser);
  }

  return sendMethodNotAllowed(res);
}
