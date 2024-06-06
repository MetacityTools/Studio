"use server";

import { z } from "zod";
import { canCreateProject } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Project } from "@features/db/entities/project";
import { injectRepository } from "@features/db/helpers";

const createProjectData = z.object({
  name: z.string(),
  description: z.string(),
});

export async function createProject(
  projectData: Pick<Project, "name" | "description">
): Promise<Project> {
  projectData = createProjectData.parse(projectData);

  if (!(await canCreateProject())) throw new Error("Unauthorized");

  const user = await getUserToken();

  const projectRepository = await injectRepository(Project);

  const project = await projectRepository.save({
    ...projectData,
    user: { id: user.id, email: user.email },
  });

  return project;
}

