"use server";

import { canReadOwnProjects } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Project } from "@features/db/entities/project";
import { injectRepository } from "@features/db/helpers";

export async function getOwnProjects(): Promise<Project[]> {
  if (!(await canReadOwnProjects())) throw new Error("Unauthorized");

  const user = await getUserToken();

  const projectRepository = await injectRepository(Project);

  const projects = await projectRepository.find({
    where: { user: { id: user.id } },
  });

  console.log(projects);
  //seriaize to plain objects
  return projects.map((project) => {
    return JSON.parse(JSON.stringify(project));
  });
}

