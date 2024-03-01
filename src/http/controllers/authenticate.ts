import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";

import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error";
import { makeAuthService } from "@/services/factories/make-authenticate-service";

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  const authBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authBodySchema.parse(req.body);

  try {
    const authService = makeAuthService();

    await authService.execute({ email, password });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }

  return reply.status(200).send();
}
