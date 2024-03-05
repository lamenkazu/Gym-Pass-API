import { FastifyRequest, FastifyReply } from "fastify";

export async function refresh(req: FastifyRequest, reply: FastifyReply) {
  await req.jwtVerify({ onlyCookie: true });

  const { role } = req.user;

  const token = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: req.user.sub,
      },
    }
  );

  const refreshToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: req.user.sub,
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
}
