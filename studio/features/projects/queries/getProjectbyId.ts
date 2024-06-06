"use server";

import { canReadOwnProjects } from "@features/auth/acl";
import { getUser } from "@features/auth/user";
import { Project } from "@features/db/entities/project";
import { injectRepository } from "@features/db/helpers";

export async function getProjectById(id: number): Promise<Project | null> {
  if (!(await canReadOwnProjects())) throw new Error("Unauthorized");

  const user = await getUser()!;

  const ProjectRepository = await injectRepository(Project);

  const project = await ProjectRepository.findOne({
    where: { id, user: { id: user.id } },
  });
  return project;
}
