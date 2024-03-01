import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";

import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { ValidateCheckInService } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

let memoryCheckInRepo: InMemoryCheckInsRepository;
let sut: ValidateCheckInService;

describe("Validate Check In Service", () => {
  beforeEach(async () => {
    memoryCheckInRepo = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInService(memoryCheckInRepo);

    vi.useFakeTimers(); //Fake Dates
  });

  afterEach(() => {
    vi.useRealTimers(); //Voltar a usar Real Dates
  });

  it("should be able to validate the check-in", async () => {
    const createdCheckIn = await memoryCheckInRepo.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
      userId: createdCheckIn.user_id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(memoryCheckInRepo.items[0].validated_at).toEqual(expect.any(Date));
  });

  it("should not be able to validate an inexistent check-in", async () => {
    await expect(() =>
      sut.execute({
        checkInId: "inexistent-checkin",
        userId: "user-01",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to validate the check-in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const createdCheckIn = await memoryCheckInRepo.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const Time21MinutesInMs = 1000 * 60 * 21;

    vi.advanceTimersByTime(Time21MinutesInMs); //Avança 21 minutos no tempo

    expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
        userId: createdCheckIn.user_id,
      })
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
