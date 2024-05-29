import { describe, expect, test, vi } from "vitest";
import { createProject, deleteProject, getProjectById, updateProject } from ".";
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

describe("project actions", () => {
  let projectId: number;

  test("Create a project", async () => {
    const project = await createProject({
      name: "Test Project",
      description: "This is a test project",
    });

    projectId = project.id;

    expect(pick(project, ["name", "description"])).toEqual({
      name: "Test Project",
      description: "This is a test project",
    });
  });

  test("Update a project", async () => {
    const updatedProject = await updateProject(projectId, {
      description: "This is an updated test project",
    });

    expect(updatedProject?.description).toBe("This is an updated test project");
  });

  test("Delete a project", async () => {
    await deleteProject(projectId);

    expect(await getProjectById(projectId)).toBe(null);
  });
});
