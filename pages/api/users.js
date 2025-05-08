import { sendOk, sendBadRequest, sendUnauthorized, sendMethodNotAllowed } from "@/utils/apiMethods";
import { getCollection } from "@/utils/functions";
import { hash } from "bcryptjs";

const COLLECTION_NAME = "users";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendMethodNotAllowed(res);
  }

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

  try {
    const collection = await getCollection(COLLECTION_NAME);

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
  } catch (error) {
    console.error(error);
    return sendBadRequest(res, "Internal server error.");
  }
}