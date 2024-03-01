import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";

import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { GetUserMetricsService } from "./get-user-metrics";

let memoryCheckInRepo: InMemoryCheckInsRepository;
let sut: GetUserMetricsService;

describe("Get User Metrics Service", () => {
  beforeEach(async () => {
    memoryCheckInRepo = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsService(memoryCheckInRepo);
  });

  it("should be able to get check-ins count from metrics", async () => {
    await memoryCheckInRepo.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    await memoryCheckInRepo.create({
      gym_id: "gym-02",
      user_id: "user-01",
    });

    const { checkInsCount } = await sut.execute({
      userId: "user-01",
    });

    expect(checkInsCount).toEqual(2);
  });
});
