import { FetchNearbyGymsService } from "../fetch-nearby-gyms";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";

export function makeFetchNearbyGymsService() {
  const gymsRepo = new PrismaGymsRepository();
  const service = new FetchNearbyGymsService(gymsRepo);

  return service;
}
