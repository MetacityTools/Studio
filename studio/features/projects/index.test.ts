import { describe, expect, test } from "vitest";
import { createProject, deleteProject, getProjectById, updateProject } from ".";
import { Project } from "../db/entities/project";

describe("project actions", () => {
  let projectId: number;

  test("project CRUD", async () => {
    // CREATE
    let project: Project | null = await createProject({
      name: "Test Project",
      description: "This is a test project",
    });

    projectId = project.id;

    // READ
    project = await getProjectById(projectId);
    expect(project).toMatchObject({
      name: "Test Project",
      description: "This is a test project",
    });

    // UPDATE
    const updatedProject = await updateProject(projectId, {
      description: "This is an updated test project",
    });

    expect(updatedProject?.description).toBe("This is an updated test project");

    // DELETE
    await deleteProject(projectId);

    expect(await getProjectById(projectId)).toBe(null);
  });
});
