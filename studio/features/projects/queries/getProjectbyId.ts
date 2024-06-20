"use server";

import { canReadProjects } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Project } from "@features/db/entities/project";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";

export async function getProjectById(id: number): Promise<Project | null> {
  if (!(await canReadProjects())) throw new Error("Unauthorized");

  const user = await getUserToken();

  const projectRepository = await injectRepository(Project);

  const project = await projectRepository.findOne({
    where: { id, user: { id: user.id } },
  });
  return toPlain(project);
}
