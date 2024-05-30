import "reflect-metadata";
import { beforeAll } from "vitest";
import { User } from "./features/db/entities/user";
import { injectRepository } from "./features/db/helpers";

beforeAll(async () => {
  const userRepository = await injectRepository(User);

  await userRepository.save({
    id: "test",
    email: "test@test",
    picture: "https://test.com/test.jpg",
    projects: [],
  });
});
