import { Gym, Prisma } from "@prisma/client";
import { FindManyNearbyParams, GymsRepository } from "../gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { randomUUID } from "crypto";
import { getDistanceBetweenCoordinate } from "@/utils/get-distance-between-coordinates";

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  async findManyNearby(params: FindManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinate(
        {
          lat: params.lat,
          long: params.long,
        },
        { lat: item.lat.toNumber(), long: item.long.toNumber() }
      );

      return distance < 10; //Até 10km
    });
  }

  async searchMany(query: string, page: number) {
    const MAX_ITEMS_PER_PAGE = 20;

    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * MAX_ITEMS_PER_PAGE, page * MAX_ITEMS_PER_PAGE);
  }

  async create({
    id,
    title,
    lat,
    long,
    description,
    phone,
  }: Prisma.GymCreateInput) {
    const gym = {
      id: id ?? randomUUID(),
      title,
      description: description ?? null,
      phone: phone ?? null,
      lat: new Decimal(lat.toString()),
      long: new Decimal(long.toString()),
    };

    this.items.push(gym);

    return gym;
  }

  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id);

    if (!gym) return null;

    return gym;
  }
}
