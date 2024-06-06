"use server";

import { canEditOwnProject } from "@features/auth/acl";
import { getUser } from "@features/auth/user";
import { Project } from "@features/db/entities/project";
import { injectRepository } from "@features/db/helpers";

export async function deleteProject(id: number): Promise<boolean> {
  if (!(await canEditOwnProject())) throw new Error("Unauthorized");

  const user = await getUser()!;

  //TODO maybe we do not have user - check it, or just use the user returned by canEditOwnProject

  const ProjectRepository = await injectRepository(Project);

  const project = await ProjectRepository.findOne({
    where: { id, user: { id: user.id } },
  });

  if (!project) throw new Error("Not Found");

  await ProjectRepository.delete(id);
  return true;
}
