"use server";

import { canEditModelMetadata } from "@features/auth/acl";
import { getUserToken } from "@features/auth/user";
import { ModelMetadata } from "@features/db/entities/modelMetadata";
import { injectRepository } from "@features/db/helpers";

export async function deleteModelMetadata(
  where: Pick<ModelMetadata, "project_id" | "model_id" | "key">
) {
  if (!(await canEditModelMetadata())) throw new Error("Unauthorized");

  const user = await getUserToken();

  const modelMetadataRepository = await injectRepository(ModelMetadata);

  await modelMetadataRepository.delete({
    ...where,
    user_id: user!.id,
  });
}
