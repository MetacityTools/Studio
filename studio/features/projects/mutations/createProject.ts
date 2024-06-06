"use server";

import { z } from "zod";
import { canCreateProject } from "@features/auth/acl";
import { getUser } from "@features/auth/user";
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

  const user = await getUser()!;

  const ProjectRepository = await injectRepository(Project);

  const project = await ProjectRepository.save({
    projectData,
    user: { id: user.id },
  });

  return project;
}
