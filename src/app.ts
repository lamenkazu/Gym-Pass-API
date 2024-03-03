import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";

import { env } from "./env";
import { ZodError } from "zod";

import { userRoutes } from "./http/controllers/users/routes";
import { gymRoutes } from "./http/controllers/gyms/routes";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(userRoutes);
app.register(gymRoutes);

app.setErrorHandler((err, _, reply) => {
  if (err instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error", issues: err.format() });
  }

  if (env.NODE_ENV !== "production") {
    console.error(err);
  } else {
    // TODO: aqui eu deveria fazer o log por uma ferramenta externa como DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: "Internal Server Error" });
});
