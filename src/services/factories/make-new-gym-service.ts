import { NewGymService } from "../new-gym";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";

export function makeNewGymsService() {
  const gymsRepo = new PrismaGymsRepository();
  const service = new NewGymService(gymsRepo);

  return service;
}
