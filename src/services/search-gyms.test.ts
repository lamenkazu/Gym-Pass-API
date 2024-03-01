import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsService } from "./search-gyms";

let memoryGymsRepository: InMemoryGymsRepository;
let sut: SearchGymsService;

describe("Search Gyms Service", () => {
  beforeEach(async () => {
    memoryGymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsService(memoryGymsRepository);
  });

  it("should be able to search for gyms", async () => {
    await memoryGymsRepository.create({
      title: "JS Gym",
      description: null,
      phone: null,
      lat: -19.8402653,
      long: -43.953214,
    });

    await memoryGymsRepository.create({
      title: "TS Gym",
      description: null,
      phone: null,
      lat: -19.8402653,
      long: -43.953214,
    });

    const { gyms } = await sut.execute({
      query: "JS",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "JS Gym" })]);
  });

  it("should be able to fetch paginated gyms search", async () => {
    for (let i = 1; i <= 22; i++) {
      await memoryGymsRepository.create({
        title: `TS Gym ${i}`,
        description: null,
        phone: null,
        lat: -19.8402653,
        long: -43.953214,
      });
    }

    const { gyms } = await sut.execute({
      query: "TS",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "TS Gym 21" }),
      expect.objectContaining({ title: "TS Gym 22" }),
    ]);
  });
});
