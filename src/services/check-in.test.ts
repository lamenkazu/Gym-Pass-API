import { expect, describe, it, beforeEach } from "vitest";

import { CheckInService } from "./check-in";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";

let memoryCheckInRepo: InMemoryCheckInsRepository;
let sut: CheckInService;

describe("Check In Service", () => {
  beforeEach(() => {
    memoryCheckInRepo = new InMemoryCheckInsRepository();
    sut = new CheckInService(memoryCheckInRepo);
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
