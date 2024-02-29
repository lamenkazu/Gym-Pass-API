import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";

interface FetchUserCheckInHistoryServiceRequest {
  userId: string;
  page: number;
}

interface FetchUserCheckInHistoryServiceResponse {
  checkIns: CheckIn[];
}

export class FetchUserCheckInHistoryService {
  constructor(private checkInRepo: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInHistoryServiceRequest): Promise<FetchUserCheckInHistoryServiceResponse> {
    const checkIns = await this.checkInRepo.findManyByUserId(userId, page);

    return {
      checkIns,
    };
  }
}
