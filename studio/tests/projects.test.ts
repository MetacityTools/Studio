import { deleteProject } from "@features/projects/mutations/deleteProject";
import { updateProject } from "@features/projects/mutations/updateProject";
import { getProjectById } from "@features/projects/queries/getProjectbyId";
import { expect } from "vitest";
import { testWithFixtures } from "./helpers";

testWithFixtures("project read", async ({ project }) => {
  // READ
  const response = await getProjectById(project.id);
  expect(response).toMatchObject({
    name: "Test Project",
    description: "This is a test project",
  });
});

testWithFixtures("project UPDATE", async ({ project }) => {
  // UPDATE
  const response = await updateProject(project!.id, {
    description: "This is an updated test project",
  });

  expect(response?.description).toBe("This is an updated test project");
});

testWithFixtures("project DELETE", async ({ project }) => {
  // DELETE
  await deleteProject(project!.id);
  expect(await getProjectById(project!.id)).toBe(null);
});
