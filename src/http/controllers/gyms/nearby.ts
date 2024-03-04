import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";

import { makeFetchNearbyGymsService } from "@/services/factories/make-fetch-nearby-gyms-service";

export async function nearby(req: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    lat: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    long: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { lat, long } = nearbyGymsQuerySchema.parse(req.query);

  const fetchNearbyGymsService = makeFetchNearbyGymsService();

  const { gyms } = await fetchNearbyGymsService.execute({
    userLat: lat,
    userLong: long,
  });

  return reply.status(200).send({
    gyms,
  });
}
