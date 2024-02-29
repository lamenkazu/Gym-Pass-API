import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";

import { CheckInService } from "./check-in";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";

let memoryCheckInRepo: InMemoryCheckInsRepository;
let memoryGymRepo: InMemoryGymsRepository;
let sut: CheckInService;

describe("Check In Service", () => {
  beforeEach(() => {
    memoryCheckInRepo = new InMemoryCheckInsRepository();
    memoryGymRepo = new InMemoryGymsRepository();
    sut = new CheckInService(memoryCheckInRepo, memoryGymRepo);

    memoryGymRepo.items.push({
      id: "gym-01",
      title: "Javascript Gym",
      lat: new Decimal(-19.8402653),
      long: new Decimal(-43.953214),
      description: "",
      phone: "",
    });

    vi.useFakeTimers(); //Fake Dates
  });

  afterEach(() => {
    vi.useRealTimers(); //Voltar a usar Real Dates
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLat: -19.8402653,
      userLong: -43.953214,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in a day", async () => {
    vi.setSystemTime(new Date(2022, 11, 1, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLat: -19.8402653,
      userLong: -43.953214,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLat: -19.8402653,
        userLong: -43.953214,
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should  be able to check in twice in a day but in different days", async () => {
    vi.setSystemTime(new Date(2022, 11, 1, 8, 0, 0));
    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLat: -19.8402653,
      userLong: -43.953214,
    });

    vi.setSystemTime(new Date(2022, 11, 2, 8, 0, 0));
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLat: -19.8402653,
      userLong: -43.953214,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  //   ,

  it("should not be able to check in in a distant gym", async () => {
    memoryGymRepo.items.push({
      id: "gym-02",
      title: "Javascript Gym",
      lat: new Decimal(-19.8972633),
      long: new Decimal(-43.8970035),
      description: "",
      phone: "",
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-02",
        userId: "user-01",
        userLat: -19.8402653,
        userLong: -43.953214,
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
