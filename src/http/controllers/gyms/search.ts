import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";

import { makeSearchGymsService } from "@/services/factories/make-search-gyms-service";

export async function search(req: FastifyRequest, reply: FastifyReply) {
  const searchGymQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { query, page } = searchGymQuerySchema.parse(req.query);

  const searchGymService = makeSearchGymsService();

  const { gyms } = await searchGymService.execute({ query, page });

  return reply.status(200).send({
    gyms,
  });
}
