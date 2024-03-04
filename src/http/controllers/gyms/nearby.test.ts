import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Fetch Nearby Gyms Controller (e2e)", () => {
  beforeAll(async () => {
    await app.ready(); //Evento do fastify para saber que a aplicação terminou de ser inicializada.
  });
  afterAll(async () => {
    await app.close(); //Depois que os testes terminarem, quero aguardar a aplicação terminar.
  });

  it("should be able to fetch nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app);

    //Cria 2 academias para pesquisar com distancias diferentes
    await request(app.server)
      .post("/gyms/new")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JS Gym",
        description: "JS rules",
        phone: "31999999999",
        lat: -19.8402653,
        long: -43.953214,
      });

    await request(app.server)
      .post("/gyms/new")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "TS Gym",
        description: "TS rules",
        phone: "31999999999",
        lat: -20.8912164,
        long: -42.3434424,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({
        lat: -19.8402653,
        long: -43.953214,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);

    expect(response.body.gyms).toHaveLength(1);

    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "JS Gym",
      }),
    ]);
  });
});
