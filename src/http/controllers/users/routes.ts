import { FastifyInstance } from "fastify";

import { register } from "@/http/controllers/users/register";
import { authenticate } from "./authenticate";
import { profile } from "./profile";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

export async function userRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/session", authenticate);

  // Authenticated
  app.get("/me", { onRequest: [verifyJWT] }, profile);
}
