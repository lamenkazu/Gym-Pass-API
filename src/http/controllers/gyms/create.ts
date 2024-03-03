import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";

import { makeNewGymsService } from "@/services/factories/make-new-gym-service";

export async function create(req: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    lat: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    long: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { title, description, phone, lat, long } = createGymBodySchema.parse(
    req.body
  );

  const createGymService = makeNewGymsService();

  await createGymService.execute({ title, description, phone, lat, long });

  return reply.status(201).send();
}
