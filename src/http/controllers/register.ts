import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";

import { RegisterService } from "@/services/register";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error";

export async function register(req: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(req.body);

  try {
    const usersRepo = new PrismaUsersRepository();
    const registerService = new RegisterService(usersRepo);

    await registerService.execute({ name, email, password });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;

    // return reply.status(500).send(); //TODO fixme
  }

  return reply.status(201).send();
}
