import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";

interface GetUserMetricsServiceRequest {
  userId: string;
}

interface GetUserMetricsServiceResponse {
  checkInsCount: number;
}

export class GetUserMetricsService {
  constructor(private checkInRepo: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsServiceRequest): Promise<GetUserMetricsServiceResponse> {
    const checkInsCount = await this.checkInRepo.countByUserId(userId);

    return {
      checkInsCount,
    };
  }
}
