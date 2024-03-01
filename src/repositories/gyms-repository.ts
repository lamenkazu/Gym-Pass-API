import { Gym, Prisma } from "@prisma/client";

export interface FindManyNearbyParams {
  lat: number;
  long: number;
}

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>;
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>;
  searchMany(query: string, page: number): Promise<Gym[]>;
  create(data: Prisma.GymCreateInput): Promise<Gym>;
}
