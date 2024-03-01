import { FetchUserCheckInHistoryService } from "../fetch-user-check-in-history";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

export function makeFetchUserCheckInHistory() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const service = new FetchUserCheckInHistoryService(checkInsRepository);

  return service;
}
