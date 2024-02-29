import { expect, describe, it, beforeEach } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { NewGymService } from "./new-gym";

let memoryGymRepo: InMemoryGymsRepository;
let sut: NewGymService;

describe("Register Service", () => {
  beforeEach(() => {
    memoryGymRepo = new InMemoryGymsRepository();
    sut = new NewGymService(memoryGymRepo);
  });

  it("should be able to register new gym", async () => {
    const { gym } = await sut.execute({
      title: "JS Gym",
      description: null,
      phone: null,
      lat: -19.8402653,
      long: -43.953214,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
