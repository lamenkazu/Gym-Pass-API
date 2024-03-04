import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(app: FastifyInstance) {
  //Cria uma conta
  await request(app.server).post("/users").send({
    name: "Jane Doe",
    email: "1@mail.com",
    password: "123456",
  });

  const authResponse = await request(app.server).post("/session").send({
    email: "1@mail.com",
    password: "123456",
  });

  const { token } = authResponse.body;

  return {
    token,
  };
}
