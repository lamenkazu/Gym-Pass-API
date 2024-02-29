import { expect, describe, it, beforeEach } from "vitest";

import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateService } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { GetUserProfileService } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let memoryUsersRepo: InMemoryUsersRepository;
let sut: GetUserProfileService;

describe("Get User Profile Service", () => {
  beforeEach(() => {
    memoryUsersRepo = new InMemoryUsersRepository();
    sut = new GetUserProfileService(memoryUsersRepo);
  });

  it("should be able to get user profile", async () => {
    const createdUser = await memoryUsersRepo.create({
      name: "Jane Doe",
      email: "janedoe@mail.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.name).toEqual("Jane Doe");
  });

  it("should not be able to get user profile with wrong id", async () => {
    await expect(() =>
      sut.execute({
        userId: "non-existing-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
