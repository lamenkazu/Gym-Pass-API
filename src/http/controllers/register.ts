import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";

import { RegisterService } from "@/services/register";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

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
    return reply.status(409).send();
  }

  return reply.status(201).send();
}
