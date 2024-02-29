import { expect, describe, it, beforeEach } from "vitest";

import { compare } from "bcryptjs";
import { RegisterService } from "./register";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

let memoryUsersRepo: InMemoryUsersRepository;
let sut: RegisterService;

describe("Register Service", () => {
  beforeEach(() => {
    memoryUsersRepo = new InMemoryUsersRepository();
    sut = new RegisterService(memoryUsersRepo);
  });

  it("should be able to register", async () => {
    const { user } = await sut.execute({
      name: "Jane Doe",
      email: "janedoe@mail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "Jane Doe",
      email: "janedoe@mail.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const email = "janedoe@mail.com";

    await sut.execute({
      name: "Jane Doe",
      email,
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        name: "Jane Doe",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
