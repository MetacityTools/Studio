"use server";

import archiveFiles from "@core/utils/archiveFiles";
import { canReadProjects } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Embed } from "@features/db/entities/embed";
import { injectRepository } from "@features/db/helpers";
import { listFilesInBucket } from "@features/storage";

export default async function getEnbedFile(id: number) {
  if (!(await canReadProjects())) throw new Error("Unauthorized");

  const user = (await getUserToken())!;

  const embedRepository = await injectRepository(Embed);

  const embed = await embedRepository.findOne({
    where: { id, project: { user: { id: user.id } } },
  });

  if (!embed) throw new Error("Not found");

  const files = await listFilesInBucket(embed.bucketName);

  const archive = await archiveFiles(files, embed.bucketName);
  return archive.to_blob().stream();
}
