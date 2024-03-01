import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateService } from "../authenticate";

export function makeAuthService() {
  const usersRepo = new PrismaUsersRepository();
  const authService = new AuthenticateService(usersRepo);

  return authService;
}
