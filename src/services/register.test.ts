import { expect, describe, it } from "vitest";

import { compare } from "bcryptjs";
import { RegisterService } from "./register";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

describe("Register Service", () => {
  it("should be able to register", async () => {
    const memoryUsersRepo = new InMemoryUsersRepository();
    const registerService = new RegisterService(memoryUsersRepo);

    const { user } = await registerService.execute({
      name: "Jane Doe",
      email: "janedoe@mail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const memoryUsersRepo = new InMemoryUsersRepository();
    const registerService = new RegisterService(memoryUsersRepo);

    const { user } = await registerService.execute({
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
    const memoryUsersRepo = new InMemoryUsersRepository();
    const registerService = new RegisterService(memoryUsersRepo);

    const email = "janedoe@mail.com";

    await registerService.execute({
      name: "Jane Doe",
      email,
      password: "123456",
    });

    await expect(() =>
      registerService.execute({
        name: "Jane Doe",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
