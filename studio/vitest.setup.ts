import "reflect-metadata";

import { beforeAll, vi } from "vitest";

beforeAll(async ({}) => {
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

  vi.mock("axios");
});
