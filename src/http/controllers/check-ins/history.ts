import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";

import { makeFetchUserCheckInHistory } from "@/services/factories/make-fetch-user-check-in-history-service";

export async function history(req: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkInHistoryQuerySchema.parse(req.query);

  const fetchUserCheckInHistoryService = makeFetchUserCheckInHistory();

  const { checkIns } = await fetchUserCheckInHistoryService.execute({
    page,
    userId: req.user.sub,
  });

  return reply.status(200).send({
    checkIns,
  });
}
