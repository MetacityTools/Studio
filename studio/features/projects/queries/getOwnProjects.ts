"use server";

import { canReadOwnProjects } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Project } from "@features/db/entities/project";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";

export async function getOwnProjects(): Promise<Project[]> {
  if (!(await canReadOwnProjects())) throw new Error("Unauthorized");

  const user = await getUserToken();

  const projectRepository = await injectRepository(Project);

  const projects = await projectRepository.find({
    where: { user: { id: user.id } },
  });

  return toPlain(projects);
}
