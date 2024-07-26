"use server";

import { canCreateModel, canCreateProject } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { ProjectVersion } from "@features/db/entities/projectVersion";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";
import {
  ensureBucket,
  getUserProjectVersionBucketName,
  saveFileStream,
} from "@features/storage";
import { Readable } from "stream";
import { ReadableStream } from "stream/web";

export async function createProjectVersion(
  projectId: number,
  file: File,
): Promise<ProjectVersion> {
  if (!(await canCreateModel())) throw new Error("Unauthorized");

  if (!(await canCreateProject())) throw new Error("Unauthorized");

  const user = await getUserToken();

  const projectVersionRepository = await injectRepository(ProjectVersion);

  const projectVersion = await projectVersionRepository.save({
    project: { id: projectId },
    user: { id: user.id, email: user.email },
  });

  try {
    // save files
    const bucketName = getUserProjectVersionBucketName(
      user.id,
      projectVersion.id,
    );

    await ensureBucket(bucketName);

    const fileStream = Readable.fromWeb(file.stream() as ReadableStream);
    await saveFileStream(file.name, bucketName, fileStream);
  } catch (e) {
    await projectVersionRepository.remove(projectVersion);
    throw e;
  }

  return toPlain({
    ...projectVersion,
    files: file.name,
  });
}
