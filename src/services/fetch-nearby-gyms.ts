import type { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";

interface FetchNearbyGymsServiceRequest {
  userLat: number;
  userLong: number;
}

interface FetchNearbyGymsServiceResponse {
  gyms: Gym[];
}

export class FetchNearbyGymsService {
  constructor(private gymsRepo: GymsRepository) {}

  async execute({
    userLat,
    userLong,
  }: FetchNearbyGymsServiceRequest): Promise<FetchNearbyGymsServiceResponse> {
    const gyms = await this.gymsRepo.findManyNearby({
      lat: userLat,
      long: userLong,
    });

    return {
      gyms,
    };
  }
}
