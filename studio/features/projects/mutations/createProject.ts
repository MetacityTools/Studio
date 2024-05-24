"use server";

import { canCreateProject } from "@features/auth/acl";
import { Project } from "@features/db/entities/project";
import { injectRepository } from "@features/db/helpers";

export async function createProject(
  projectData: Omit<Project, "id">
): Promise<Project> {
  if (!(await canCreateProject())) throw new Error("Unauthorized");

  const ProjectRepository = await injectRepository(Project);

  const project = await ProjectRepository.save(projectData);
  return project;
}
