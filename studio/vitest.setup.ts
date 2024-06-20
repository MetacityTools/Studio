import "reflect-metadata";
import { afterAll, beforeAll, vi } from "vitest";
import { User } from "./features/db/entities/user";
import { injectRepository } from "./features/db/helpers";

beforeAll(async () => {
  const userRepository = await injectRepository(User);

  await userRepository.save({
    id: "test",
    email: "test@test",
    picture: "https://test.com/test.jpg",
    projects: [],
    idAuth0: "test",
    enabled: true,
  });

  vi.mock("@auth0/nextjs-auth0", () => ({
    getSession: async () => ({
      user: {
        sub: "test",
        email: "test@test",
        picture: "https://example.com/picture.png",
        idAuth0: "test",
        enabled: true,
      },
    }),
  }));
});

afterAll(async () => {
  const userRepository = await injectRepository(User);

  await userRepository.delete({
    id: "test",
  });
});
