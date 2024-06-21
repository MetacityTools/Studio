"use server";

import { canEditMetadata } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Metadata } from "@features/db/entities/metadata";
import { injectRepository } from "@features/db/helpers";

export async function deleteMetadata(
  where: Pick<Metadata, "project_id" | "model_id" | "key">,
) {
  if (!(await canEditMetadata())) throw new Error("Unauthorized");

  const user = await getUserToken();

  const metadataRepository = await injectRepository(Metadata);

  await metadataRepository.delete({
    ...where,
    user_id: user!.id,
  });
}
