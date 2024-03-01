import { hash } from "bcryptjs";

import { UsersRepository } from "@/repositories/users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import type { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";

interface NewGymServiceRequest {
  title: string;
  description?: string | null;
  phone: string | null;
  lat: number;
  long: number;
}

interface NewGymServiceResponse {
  gym: Gym;
}

export class NewGymService {
  constructor(private gymsRepo: GymsRepository) {}

  async execute({
    title,
    description,
    phone,
    lat,
    long,
  }: NewGymServiceRequest): Promise<NewGymServiceResponse> {
    const gym = await this.gymsRepo.create({
      title,
      description,
      phone,
      lat,
      long,
    });

    return {
      gym,
    };
  }
}
