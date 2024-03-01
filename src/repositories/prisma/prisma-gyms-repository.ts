import { Gym, Prisma } from "@prisma/client";
import { FindManyNearbyParams, GymsRepository } from "../gyms-repository";
import { prisma } from "@/lib/prisma";

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: { id },
    });

    return gym;
  }

  async findManyNearby({ lat, long }: FindManyNearbyParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
        SELECT * from gyms
        WHERE ( 6371 * acos( cos( radians(${lat}) ) * cos( radians( lat ) ) * cos( radians( long ) - radians(${long}) ) + sin( radians(${lat}) ) * sin( radians( lat ) ) ) ) <= 10        
    `;

    return gyms;
  }

  async searchMany(query: string, page: number) {
    const MAX_ITEMS_PER_PAGE = 20;

    const gyms = await prisma.gym.findMany({
      take: MAX_ITEMS_PER_PAGE,
      skip: (page - 1) * MAX_ITEMS_PER_PAGE,
      where: {
        title: {
          contains: query,
        },
      },
    });

    return gyms;
  }

  async create(data: Prisma.GymCreateInput) {
    const newGym = await prisma.gym.create({
      data,
    });

    return newGym;
  }
}
