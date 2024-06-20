import { ModelMetadata } from "@features/db/entities/modelMetadata";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";

export async function getAllProjectMetadata(projectId: number) {
  const modelMedatadatRepository = await injectRepository(ModelMetadata);

  const metadata = await modelMedatadatRepository.find({
    where: {
      project: {
        id: projectId,
      },
    },
  });

  return toPlain(metadata);
}
