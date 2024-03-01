import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsService } from "./fetch-nearby-gyms";

let memoryGymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsService;

describe("Fetch Nearby Gyms Service", () => {
  beforeEach(async () => {
    memoryGymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsService(memoryGymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await memoryGymsRepository.create({
      title: "Near Gym",
      description: null,
      phone: null,
      lat: -19.8402653,
      long: -43.953214,
    });

    await memoryGymsRepository.create({
      title: "Far Gym",
      description: null,
      phone: null,
      lat: -20.8912164,
      long: -42.3434424,
    });

    const { gyms } = await sut.execute({
      userLat: -19.8972633,
      userLong: -43.8970035,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
