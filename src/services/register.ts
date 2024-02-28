import { hash } from "bcryptjs";

import { UsersRepository } from "@/repositories/users-repository";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterService {
  constructor(private usersRepo: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepo.findByEmail(email);

    if (userWithSameEmail) {
      throw new Error("Email alredy exists");
    }

    await this.usersRepo.create({
      name,
      email,
      password_hash,
    });
  }
}
