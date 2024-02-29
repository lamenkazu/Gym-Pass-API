import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gym-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { getDistanceBetweenCoordinate } from "@/utils/get-distance-between-coordinates";

interface CheckInServiceRequest {
  userId: string;
  gymId: string;
  userLat: number;
  userLong: number;
}

interface CheckInServiceResponse {
  checkIn: CheckIn;
}

export class CheckInService {
  constructor(
    private checkInRepo: CheckInsRepository,
    private gymsRepo: GymsRepository
  ) {}

  async execute({
    userId,
    gymId,
    userLat,
    userLong,
  }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const gym = await this.gymsRepo.findById(gymId);
    if (!gym) throw new ResourceNotFoundError();

    const distance = getDistanceBetweenCoordinate(
      { lat: userLat, long: userLong },
      { lat: gym.lat.toNumber(), long: gym.long.toNumber() }
    );

    const MAX_DISTANCE_IN_KM = 0.1; //100 m

    if (distance > MAX_DISTANCE_IN_KM) throw new Error();

    const checkInOnSameDay = await this.checkInRepo.findByUserIdOnDate(
      userId,
      new Date()
    );
    if (checkInOnSameDay) throw new Error();

    const checkIn = await this.checkInRepo.create({
      gym_id: gymId,
      user_id: userId,
    });

    return {
      checkIn,
    };
  }
}
