import { FastifyRequest, FastifyReply } from "fastify";

import { makeGetUserMetricsService } from "@/services/factories/make-get-user-metrics-service";

export async function metrics(req: FastifyRequest, reply: FastifyReply) {
  const getUserMetricsService = makeGetUserMetricsService();

  const { checkInsCount } = await getUserMetricsService.execute({
    userId: req.user.sub,
  });

  return reply.status(200).send({
    checkInsCount,
  });
}
