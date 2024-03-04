import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Create Gym Controller (e2e)", () => {
  beforeAll(async () => {
    await app.ready(); //Evento do fastify para saber que a aplicação terminou de ser inicializada.
  });
  afterAll(async () => {
    await app.close(); //Depois que os testes terminarem, quero aguardar a aplicação terminar.
  });

  it("should be able to get create a gym", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .post("/gyms/new")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JS Gym",
        description: "JS rules",
        phone: "31999999999",
        lat: -19.8402653,
        long: -43.953214,
      });

    expect(response.statusCode).toEqual(201);
  });
});
