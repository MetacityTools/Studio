"use server";

import { canCreateModel, canCreateProject } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { ProjectVersion } from "@features/db/entities/projectVersion";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";
import {
  ensureBucket,
  getProjectVersionBucketName,
  saveFileStream,
} from "@features/storage";
import { randomUUID } from "crypto";
import { Readable } from "stream";
import { ReadableStream } from "stream/web";

export async function createProjectVersion(
  projectId: number,
  dataFile: File,
  thumbnailFileContents: string,
): Promise<ProjectVersion> {
  if (!(await canCreateModel())) throw new Error("Unauthorized");

  if (!(await canCreateProject())) throw new Error("Unauthorized");

  const user = await getUserToken();

  const ProjectVersionRepository = await injectRepository(ProjectVersion);

  const versionFileName = randomUUID();

  const bucketName = getProjectVersionBucketName(versionFileName);

  const projectVersion = await ProjectVersionRepository.save({
    bucketName: bucketName,
    thumbnailContents: thumbnailFileContents,
    project: { id: projectId },
    user: { id: user.id, email: user.email },
  });

  try {
    await ensureBucket(bucketName);
    const dataFileStream = Readable.fromWeb(
      dataFile.stream() as ReadableStream,
    );
    await saveFileStream(dataFile.name, bucketName, dataFileStream);
  } catch (e) {
    await ProjectVersionRepository.remove(projectVersion);
    throw e;
  }

  return toPlain({
    ...projectVersion,
  });
}
