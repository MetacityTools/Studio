import { canEditOwnModelMetadata } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { ModelMetadata } from "@features/db/entities/modelMetadata";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";

export async function saveModelMetadata(
  metadata: Pick<
    ModelMetadata,
    "project_id" | "model_id" | "object_id" | "key" | "value" | "type"
  >
) {
  if (!(await canEditOwnModelMetadata())) throw new Error("Unauthorized");

  const userToken = await getUserToken();

  const modelMetadataRepository = await injectRepository(ModelMetadata);

  const savedMetadata = await modelMetadataRepository.save({
    ...metadata,
    id: null,
    user_id: userToken!.id,
  });

  return toPlain(savedMetadata);
}
