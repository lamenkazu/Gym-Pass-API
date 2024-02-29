import { expect, describe, it, beforeEach } from "vitest";

import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateService } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let memoryUsersRepo: InMemoryUsersRepository;
let sut: AuthenticateService;

describe("Authenticate Service", () => {
  beforeEach(() => {
    memoryUsersRepo = new InMemoryUsersRepository();
    sut = new AuthenticateService(memoryUsersRepo);
  });

  it("should be able to authenticate", async () => {
    await memoryUsersRepo.create({
      name: "Jane Doe",
      email: "janedoe@mail.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "janedoe@mail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    await expect(() =>
      sut.execute({
        email: "janedoe@mail.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await memoryUsersRepo.create({
      name: "Jane Doe",
      email: "janedoe@mail.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        email: "janedoe@mail.com",
        password: "654321",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
