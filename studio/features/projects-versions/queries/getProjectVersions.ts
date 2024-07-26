"use server";

import { canReadProjects } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { ProjectVersion } from "@features/db/entities/projectVersion";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";

export default async function getProjectVersions(projectId: number) {
  if (!(await canReadProjects())) throw new Error("Unauthorized");

  const user = (await getUserToken())!;

  const projectVersionRepository = await injectRepository(ProjectVersion);

  const projectVersions = await projectVersionRepository.find({
    where: { project: { id: projectId, user: { id: user.id } } },
  });
  if (!projectVersions) throw new Error("Not found");
  return toPlain(projectVersions);
}
