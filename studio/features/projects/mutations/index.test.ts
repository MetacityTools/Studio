import { expect, test } from "vitest";

import { Project } from "@features/db/entities/project";
import { createProject } from "./createProject";
import { getProjectById } from "../queries/getProjectbyId";
import { updateProject } from "./updateProject";
import { deleteProject } from "./deleteProject";

test("project CRUD", async () => {
  let project: Project | null;

  // CREATE
  project = await createProject({
    name: "Test Project",
    description: "This is a test project",
  });

  // READ
  project = await getProjectById(project.id);
  expect(project).toMatchObject({
    name: "Test Project",
    description: "This is a test project",
  });

  // UPDATE
  project = await updateProject(project!.id, {
    description: "This is an updated test project",
  });

  expect(project?.description).toBe("This is an updated test project");

  // DELETE
  await deleteProject(project!.id);

  expect(await getProjectById(project!.id)).toBe(null);
});
