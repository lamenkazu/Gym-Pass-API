import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterService } from "../register";

export function makeRegisterService() {
  const usersRepo = new PrismaUsersRepository();
  const registerService = new RegisterService(usersRepo);

  return registerService;
}
