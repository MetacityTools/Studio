"use server";

import { canEditOwnProject } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Model } from "@features/db/entities/model";
import { Project } from "@features/db/entities/project";
import { injectRepository } from "@features/db/helpers";

export async function addModelToProject(project_id: number, model_id: number) {
  if (!(await canEditOwnProject())) return false;

  const user = await getUserToken();

  const modelsRepository = await injectRepository(Model);
  const projectsRepository = await injectRepository(Project);

  const model = await modelsRepository.findOne({
    where: { id: model_id, user: { id: user.id } },
  });
  if (!model) throw new Error("Model not found");

  const project = await projectsRepository.findOne({
    where: { id: project_id, user: { id: user.id } },
  });
  if (!project) throw new Error("Project not found");

  project.models = [...(project.models ?? []), model];

  await projectsRepository.save(project);
}
