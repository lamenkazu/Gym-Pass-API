import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";

import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { FetchUserCheckInHistoryService } from "./fetch-user-check-in-history";

let memoryCheckInRepo: InMemoryCheckInsRepository;
let sut: FetchUserCheckInHistoryService;

describe("Fetch Check-In History Service", () => {
  beforeEach(async () => {
    memoryCheckInRepo = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInHistoryService(memoryCheckInRepo);
  });

  it("should be able to fetch check in history from a user", async () => {
    await memoryCheckInRepo.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    await memoryCheckInRepo.create({
      gym_id: "gym-02",
      user_id: "user-01",
    });

    const { checkIns } = await sut.execute({
      userId: "user-01",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-01" }),
      expect.objectContaining({ gym_id: "gym-02" }),
    ]);
  });

  it("should be able to fetch paginated check in history from a user", async () => {
    for (let i = 1; i <= 22; i++) {
      await memoryCheckInRepo.create({
        gym_id: `gym-${i}`,
        user_id: "user-01",
      });
    }

    const { checkIns } = await sut.execute({
      userId: "user-01",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-21" }),
      expect.objectContaining({ gym_id: "gym-22" }),
    ]);
  });
});
