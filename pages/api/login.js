import { sendOk, sendUnauthorized, sendBadRequest, sendMethodNotAllowed } from "@/utils/apiMethods";
import { getCollection } from "@/utils/functions";
import { compare } from "bcryptjs";

const COLLECTION_NAME = "users";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendMethodNotAllowed(res);
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return sendBadRequest(res, "Email and password are required.");
  }

  try {
    const collection = await getCollection(COLLECTION_NAME);
    const user = await collection.findOne({ email });

    if (!user) {
      return sendUnauthorized(res, "Invalid email or password.");
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      return sendUnauthorized(res, "Invalid email or password.");
    }

    // Doar ce ai nevoie mai departe (fără parolă)
    return sendOk(res, {
        name: user.name,
        role: user.role,
        checkChef: user.checkChef,
        email: user.email,
        phone: user.phone || "", // ✅ Add this line
        profilePicture: user.profilePicture || "" // also good to include
    });
  } catch (error) {
    console.error(error);
    return sendBadRequest(res, "Login failed. Try again later.");
  }
}