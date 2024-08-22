import { canEditProject } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Embed } from "@features/db/entities/embed";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";
import {
  ensureBucket,
  getEmbedBucketName,
  saveFileStream,
} from "@features/storage";
import { Readable } from "stream";
import { ReadableStream } from "stream/web";

export async function createEmbed(projectId: number, files: File[]) {
  if (!(await canEditProject())) throw new Error("Unauthorized");

  const user = await getUserToken();

  const embedRepository = await injectRepository(Embed);

  // create the embed in the database
  const embed = await embedRepository.save({
    project: { id: projectId },
  });

  // create a bucket for the embed
  embed.bucketId = getEmbedBucketName(embed.id);
  await ensureBucket(embed.bucketId);

  // save the bucket id to the database
  await embedRepository.save(embed);

  // save the files to the bucket
  try {
    for (const file of files) {
      const fileStream = Readable.fromWeb(file.stream() as ReadableStream);
      await saveFileStream(file.name, embed.bucketId, fileStream);
    }
  } catch (e) {
    await embedRepository.remove(embed);
    throw e;
  }

  // return the embed
  return toPlain(embed);
}
