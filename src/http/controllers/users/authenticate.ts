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

    const { user } = await authService.execute({ email, password });

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      }
    );

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
          expiresIn: "7d",
        },
      }
    );

    return reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true, //se true é HTTPS.
        sameSite: true, //esse cookie só é acessivel dentro do mesmo domínio (mesmo site)
        httpOnly: true, //Esse cookie só consegue ser acessado pelo backend da aplicação e nao pelo frontend - só pode ser acessado através da requisição e resposta. Não fica salvo dentro do browser.
      })
      .status(200)
      .send({ token });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }
}
