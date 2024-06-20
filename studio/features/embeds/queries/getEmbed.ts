import { canReadOwnProjects } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Embed } from "@features/db/entities/embed";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";
import { listFilesInBucket } from "@features/storage";

export async function getEmbed(id: number) {
  if (!(await canReadOwnProjects())) throw new Error("Unauthorized");

  const user = await getUserToken();

  const embedRepository = await injectRepository(Embed);

  // get the embed from the database
  const embed = await embedRepository.findOne({
    where: { id, project: { user: { id: user.id } } },
  });

  if (!embed) throw new Error("Embed not found");

  // get the filenames in the embed bucket
  const files = await listFilesInBucket(embed.bucketId);

  // return the embed
  return toPlain({ ...embed, files });
}
