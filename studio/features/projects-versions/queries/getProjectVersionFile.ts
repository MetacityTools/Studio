"use server";

import archiveFiles from "@core/utils/archiveFiles";
import { canReadProjects } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { ProjectVersion } from "@features/db/entities/projectVersion";
import { injectRepository } from "@features/db/helpers";
import {
  getUserProjectVersionBucketName,
  listFilesInBucket,
} from "@features/storage";

export default async function getProjectVersionFile(projectVersionId: number) {
  if (!(await canReadProjects())) throw new Error("Unauthorized");

  const user = (await getUserToken())!;

  const projectVersionRepository = await injectRepository(ProjectVersion);

  console.log("projectVersionId", projectVersionId);

  const projectVersion = await projectVersionRepository.findOne({
    where: { id: projectVersionId, project: { user: { id: user.id } } },
  });
  if (!projectVersion) throw new Error("Not found");

  const bucketName = getUserProjectVersionBucketName(
    user.id,
    projectVersion.id,
  );
  const files = await listFilesInBucket(bucketName);
  const archive = await archiveFiles(files, bucketName);
  return archive.to_blob().stream();
}
