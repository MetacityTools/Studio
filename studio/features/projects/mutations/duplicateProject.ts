"use server";

import { canCreateProject } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Project } from "@features/db/entities/project";
import { ProjectVersion } from "@features/db/entities/projectVersion";
import { injectRepository } from "@features/db/helpers";
import getLatestProjectVersions from "@features/projects-versions/queries/getLatestProjectVersion";

export async function duplicateProject(id: number): Promise<Project> {
  if (!(await canCreateProject())) throw new Error("Unauthorized");

  const user = await getUserToken();

  const ProjectRepository = await injectRepository(Project);
  const ProjectVersionRepository = await injectRepository(ProjectVersion);

  const project = await ProjectRepository.findOne({
    where: { id, user: { id: user.id } },
  });

  if (!project) throw new Error("Not Found");

  const duplicate = (await ProjectRepository.save({
    ...project,
    id: undefined,
    name: `${project.name} (copy)`,
    user: user,
  })) as Project;

  const latestVersion = await getLatestProjectVersions(project.id);
  if (!latestVersion) return duplicate;

  await ProjectVersionRepository.save({
    bucketName: latestVersion.bucketName,
    project: { id: duplicate.id },
    user: { id: user.id, email: user.email },
  });

  return duplicate;
}
