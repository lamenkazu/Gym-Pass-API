import { Gym, Prisma } from "@prisma/client";
import { GymsRepository } from "../gym-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { randomUUID } from "crypto";

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

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
