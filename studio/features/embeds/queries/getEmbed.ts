import { canReadProjects } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Embed } from "@features/db/entities/embed";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";
import { checkBucketExists, listFilesInBucket } from "@features/storage";

export async function getEmbed(id: number) {
  if (!(await canReadProjects())) throw new Error("Unauthorized");

  const user = await getUserToken();

  const embedRepository = await injectRepository(Embed);

  // get the embed from the database
  const embed = await embedRepository.findOne({
    where: { id, project: { user: { id: user.id } } },
  });
  if (!embed) return null;

  // get the filenames in the embed bucket
  const files =
    embed.bucketId && (await checkBucketExists(embed.bucketId))
      ? await listFilesInBucket(embed.bucketId)
      : null;

  // return the embed
  return toPlain({ ...embed, files });
}
