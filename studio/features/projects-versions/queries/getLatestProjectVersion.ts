"use server";

import { canReadProjects } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { ProjectVersion } from "@features/db/entities/projectVersion";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";

export default async function getLatestProjectVersions(projectId: number) {
  if (!(await canReadProjects())) throw new Error("Unauthorized");

  const user = (await getUserToken())!;

  const projectVersionRepository = await injectRepository(ProjectVersion);

  const latestProjectVersion = await projectVersionRepository.findOne({
    where: { project: { id: projectId, user: { id: user.id } } },
    order: { updated_at: "DESC" },
  });
  if (!latestProjectVersion) return null;
  return toPlain(latestProjectVersion);
}
