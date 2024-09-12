"use server";

import { canReadProjects } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Embed } from "@features/db/entities/embed";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";

export default async function getEmbed(id: number) {
  if (!(await canReadProjects())) throw new Error("Unauthorized");

  const user = (await getUserToken())!;

  const embedRepository = await injectRepository(Embed);

  const embed = await embedRepository.findOne({
    where: { id, project: { user: { id: user.id } } },
  });

  if (!embed) throw new Error("Not found");

  return toPlain(embed);
}
