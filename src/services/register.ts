import { hash } from "bcryptjs";

import { UsersRepository } from "@/repositories/users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import type { User } from "@prisma/client";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterServieResponse {
  user: User;
}

export class RegisterService {
  constructor(private usersRepo: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterServieResponse> {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepo.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.usersRepo.create({
      name,
      email,
      password_hash,
    });

    return {
      user,
    };
  }
}
