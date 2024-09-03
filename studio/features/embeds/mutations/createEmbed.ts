import { canEditProject } from "@features/auth/acl";
import { Embed } from "@features/db/entities/embed";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";
import {
  ensureBucket,
  getEmbedBucketName,
  saveFileStream,
} from "@features/storage";
import { randomUUID } from "crypto";
import { Readable } from "stream";
import { ReadableStream } from "stream/web";

export async function createEmbed(
  projectId: number,
  name: string,
  file: File,
  thumbnailFileContents: string,
) {
  if (!(await canEditProject())) throw new Error("Unauthorized");

  const embedRepository = await injectRepository(Embed);

  const versionFileName = randomUUID();

  const bucketName = getEmbedBucketName(versionFileName);

  // create the embed in the database
  const embed = await embedRepository.save({
    project: { id: projectId },
    name: name,
    thumbnailContents: thumbnailFileContents,
    bucketName: bucketName,
  });

  // save the files to the bucket
  try {
    await ensureBucket(embed.bucketName);
    const fileStream = Readable.fromWeb(file.stream() as ReadableStream);
    await saveFileStream(file.name, embed.bucketName, fileStream);
  } catch (e) {
    await embedRepository.remove(embed);
    throw e;
  }

  // return the embed
  return toPlain(embed);
}
