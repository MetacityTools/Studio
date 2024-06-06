"use server";

import { z } from "zod";
import { canEditOwnProject } from "@features/auth/acl";
import { getUser } from "@features/auth/user";
import { Project } from "@features/db/entities/project";
import { injectRepository } from "@features/db/helpers";

const updateProjectData = z.object({
  name: z.string(),
  description: z.string(),
});

export async function updateProject(
  id: number,
  projectData: Partial<Pick<Project, "name" | "description">>
): Promise<Project | null> {
  projectData = updateProjectData.parse(projectData);

  if (!(await canEditOwnProject())) throw new Error("Unauthorized");

  const user = await getUser()!;

  const ProjectRepository = await injectRepository(Project);

  const project = await ProjectRepository.findOne({
    where: { id, user: { id: user.id } },
  });

  if (!project) throw new Error("Not Found");

  return ProjectRepository.save({
    id,
    name: projectData.name ?? project.name,
    description: projectData.description ?? project.description,
  });
}
