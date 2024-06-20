import { expect, test } from "vitest";

import { getUserToken } from "@features/auth/user";
import { Model } from "@features/db/entities/model";
import { Project } from "@features/db/entities/project";
import { injectRepository } from "@features/db/helpers";
import { getProjectById } from "../queries/getProjectbyId";
import { addModelToProject } from "./addModelToProject";
import { createProject } from "./createProject";
import { deleteProject } from "./deleteProject";
import { removeModelFromProject } from "./removeModelFromProject";
import { updateProject } from "./updateProject";

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

test("models in project CRD", async () => {
  let project: Project | null;
  let model: Model | null;

  const projectRepository = await injectRepository(Project);
  const modelRepository = await injectRepository(Model);

  const user = await getUserToken();

  // CREATE DB TEST DATA
  project = await projectRepository.save({
    name: "Test Project",
    description: "This is a test project",
    user: { id: user.id },
  });

  model = await modelRepository.save({
    name: "Test Model",
    coordinateSystem: "WGS84",
    user: { id: user.id },
  });

  // ADD MODEL TO PROJECT
  await addModelToProject(project!.id, model!.id);

  // GET PROJECT MODELS
  project = await getProjectById(project!.id);
  expect(project?.models).toHaveLength(1);
  expect(project?.models?.[0].name).toBe("Test Model");

  // REMOVE MODEL FROM PROJECT
  await removeModelFromProject(project!.id, model!.id);

  // GET PROJECT MODELS
  project = await getProjectById(project!.id);
  expect(project?.models).toHaveLength(0);

  // DB CLEANUP
  await modelRepository.delete(model!.id);
  await projectRepository.delete(project!.id);
});
