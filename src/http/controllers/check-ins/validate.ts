import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeCheckInService } from "@/services/factories/make-check-in-service";
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error";
import { MaxDistanceError } from "@/services/errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "@/services/errors/max-number-of-check-ins-error";
import { makeValidateCheckInService } from "@/services/factories/make-validate-check-in-service";
import { LateCheckInValidationError } from "@/services/errors/late-check-in-validation-error";

export async function validate(req: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  });

  const { checkInId } = validateCheckInParamsSchema.parse(req.params);

  try {
    const validateCheckInService = makeValidateCheckInService();

    await validateCheckInService.execute({
      userId: req.user.sub,
      checkInId,
    });
  } catch (err) {
    if (err instanceof LateCheckInValidationError) {
      return reply.status(408).send({ message: err.message });
    }

    throw err;
  }

  return reply.status(204).send();
}
