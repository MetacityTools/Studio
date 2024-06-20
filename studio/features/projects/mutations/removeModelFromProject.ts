"use server";

import { canEditOwnProject } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Project } from "@features/db/entities/project";
import { injectRepository } from "@features/db/helpers";

export async function removeModelFromProject(
  project_id: number,
  model_id: number,
) {
  if (!(await canEditOwnProject())) return false;

  const user = await getUserToken();

  const projectsRepository = await injectRepository(Project);

  // load project with models
  const project = await projectsRepository.findOne({
    where: { id: project_id, user: { id: user.id } },
    relations: ["models"],
  });
  if (!project) throw new Error("Project not found");

  // find model in project
  const i = project.models?.findIndex((m) => m.id === model_id);
  if (i === undefined || i === -1) throw new Error("Model not found");

  // remove model from project
  project.models?.splice(i, 1);

  await projectsRepository.save(project);
}
