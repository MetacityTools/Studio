import { expect, test, vi } from "vitest";
import { createProject, deleteProject } from ".";
import { pick } from "../helpers/objects";

vi.mock("@auth0/nextjs-auth0", () => ({
  getSession: async () => ({
    user: {
      sub: "test",
      email: "test@test",
      picture: "https://example.com/picture.png",
    },
  }),
}));

test("Create a project", async () => {
  const project = await createProject({
    name: "Test Project",
    description: "This is a test project",
  });

  expect(pick(project, ["name", "description"])).toEqual({
    name: "Test Project",
    description: "This is a test project",
  });

  await deleteProject(project.id);
});
