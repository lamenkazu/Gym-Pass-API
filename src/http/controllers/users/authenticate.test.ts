import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Authenticate Controller (e2e)", () => {
  beforeAll(async () => {
    await app.ready(); //Evento do fastify para saber que a aplicação terminou de ser inicializada.
  });
  afterAll(async () => {
    await app.close(); //Depois que os testes terminarem, quero aguardar a aplicação terminar.
  });

  it("should be able to authenticate", async () => {
    //Cria uma conta
    await request(app.server).post("/users").send({
      name: "Jane Doe",
      email: "1@mail.com",
      password: "123456",
    });

    const response = await request(app.server).post("/session").send({
      email: "1@mail.com",
      password: "123456",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});
