import { canEditProject } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Embed } from "@features/db/entities/embed";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";
import {
  checkBucketExists,
  deleteBucket,
  deleteFile,
  listFilesInBucket,
} from "@features/storage";

export async function deleteEmbed(embedId: number) {
  if (!(await canEditProject())) throw new Error("Unauthorized");

  const user = await getUserToken();

  const embedRepository = await injectRepository(Embed);

  // find the embed
  const embed = await embedRepository.findOne({
    where: { id: embedId, project: { user: { id: user.id } } },
  });
  if (!embed) throw new Error("Embed not found");

  if (embed.bucketName && (await checkBucketExists(embed.bucketName))) {
    // delete all files in the embed bucket
    const files = await listFilesInBucket(embed.bucketName);

    for (const file of files) {
      await deleteFile(file, embed.bucketName);
    }

    await deleteBucket(embed.bucketName);
  }

  // delete the embed from the database
  await embedRepository.remove(embed);

  return toPlain(embed);
}
