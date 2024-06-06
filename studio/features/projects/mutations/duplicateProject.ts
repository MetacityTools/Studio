"use server";

import { canCreateProject } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Project } from "@features/db/entities/project";
import { injectRepository } from "@features/db/helpers";

export async function duplicateProject(id: number): Promise<Project> {
  if (!(await canCreateProject())) throw new Error("Unauthorized");

  const user = await getUserToken();

  const ProjectRepository = await injectRepository(Project);

  const project = await ProjectRepository.findOne({
    where: { id, user: { id: user.id } },
  });

  if (!project) throw new Error("Not Found");

  return ProjectRepository.save({
    ...project,
    id: undefined,
    name: `${project.name} (copy)`,
  });
}
