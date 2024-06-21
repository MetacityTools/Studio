import { expect } from "vitest";

import { Project } from "@features/db/entities/project";
import { injectRepository } from "@features/db/helpers";
import { addModelToProject } from "@features/projects/mutations/addModelToProject";
import { deleteProject } from "@features/projects/mutations/deleteProject";
import { removeModelFromProject } from "@features/projects/mutations/removeModelFromProject";
import { updateProject } from "@features/projects/mutations/updateProject";
import { getProjectById } from "@features/projects/queries/getProjectbyId";
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

testWithFixtures("add model to project", async ({ project, model }) => {
  const projectRepository = await injectRepository(Project);

  await addModelToProject(project!.id, model!.id);

  {
    const response = await projectRepository.findOne({
      where: { id: project!.id },
      relations: ["models"],
    });
    expect(response?.models).toHaveLength(1);
    expect(response?.models?.[0].name).toBe("Test Model");
  }

  await removeModelFromProject(project!.id, model!.id);

  {
    const response = await projectRepository.findOne({
      where: { id: project!.id },
      relations: ["models"],
    });
    expect(response?.models).toHaveLength(0);
  }
});
