import { canEditMetadata } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { Metadata } from "@features/db/entities/metadata";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";

export async function saveMetadata(
  metadata: Pick<
    Metadata,
    "project_id" | "model_id" | "object_id" | "key" | "value" | "type"
  >,
) {
  if (!(await canEditMetadata())) throw new Error("Unauthorized");

  const userToken = await getUserToken();

  const metadataRepository = await injectRepository(Metadata);

  const savedMetadata = await metadataRepository.save({
    ...metadata,
    id: null,
    user_id: userToken!.id,
  });

  return toPlain(savedMetadata);
}
