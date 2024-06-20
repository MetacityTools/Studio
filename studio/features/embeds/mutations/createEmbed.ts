import { canCreateEmbedOfOwnProject } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Embed } from "@features/db/entities/embed";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";
import {
  ensureBucket,
  getUserEmbedBucketName,
  saveFileStream,
} from "@features/storage";
import { Readable } from "stream";
import { ReadableStream } from "stream/web";

export async function createEmbed(
  projectId: number,
  files: {
    geometry: File;
    metadata: File;
    style: File;
  },
) {
  if (!(await canCreateEmbedOfOwnProject())) throw new Error("Unauthorized");

  const user = await getUserToken();

  const embedRepository = await injectRepository(Embed);

  const embed = await embedRepository.save({
    project: { id: projectId },
  });

  const bucketName = getUserEmbedBucketName(user.id, embed.id);
  await ensureBucket(bucketName);

  try {
    for (const [filename, file] of Object.entries(files)) {
      const fileStream = Readable.fromWeb(file.stream() as ReadableStream);
      await saveFileStream(filename, bucketName, fileStream);
    }
  } catch (e) {
    await embedRepository.remove(embed);
    throw e;
  }

  return toPlain(embed);
}
