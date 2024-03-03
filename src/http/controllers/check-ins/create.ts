import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeCheckInService } from "@/services/factories/make-check-in-service";
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error";
import { MaxDistanceError } from "@/services/errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "@/services/errors/max-number-of-check-ins-error";

export async function create(req: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const createCheckInBodySchema = z.object({
    lat: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    long: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { gymId } = createCheckInParamsSchema.parse(req.params);
  const { lat, long } = createCheckInBodySchema.parse(req.body);

  try {
    const createCheckInService = makeCheckInService();

    await createCheckInService.execute({
      gymId,
      userId: req.user.sub,
      userLat: lat,
      userLong: long,
    });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    } else if (err instanceof MaxDistanceError) {
      return reply.status(400).send({ message: err.message });
    } else if (err instanceof MaxNumberOfCheckInsError) {
      return reply.status(429).send({ message: err.message });
    }

    throw err;
  }

  return reply.status(201).send();
}
