"use server";

import archiveFiles from "@core/utils/archiveFiles";
import { canReadProjects } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { ProjectVersion } from "@features/db/entities/projectVersion";
import { injectRepository } from "@features/db/helpers";
import { listFilesInBucket } from "@features/storage";

export default async function getProjectVersionFile(projectVersionId: number) {
  if (!(await canReadProjects())) throw new Error("Unauthorized");

  const user = (await getUserToken())!;

  const projectVersionRepository = await injectRepository(ProjectVersion);

  const projectVersion = await projectVersionRepository.findOne({
    where: { id: projectVersionId, project: { user: { id: user.id } } },
  });

  if (!projectVersion) throw new Error("Not found");

  const files = await listFilesInBucket(projectVersion.bucketName);

  const archive = await archiveFiles(files, projectVersion.bucketName);
  return archive.to_blob().stream();
}
