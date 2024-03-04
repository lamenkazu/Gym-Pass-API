import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Search Gyms Controller (e2e)", () => {
  beforeAll(async () => {
    await app.ready(); //Evento do fastify para saber que a aplicação terminou de ser inicializada.
  });
  afterAll(async () => {
    await app.close(); //Depois que os testes terminarem, quero aguardar a aplicação terminar.
  });

  it("should be able to search gyms by title", async () => {
    const { token } = await createAndAuthenticateUser(app);

    //Cria 2 academias para pesquisar
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
        lat: -19.8402653,
        long: -43.953214,
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .query({
        query: "JS",
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
