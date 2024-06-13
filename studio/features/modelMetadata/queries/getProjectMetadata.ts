import { ModelMetadata } from "@features/db/entities/modelMetadata";
import { injectRepository } from "@features/db/helpers";

export async function getProjectMetadata(projectId: number) {
  const modelMedatadatRepository = await injectRepository(ModelMetadata);

  const metadata = await modelMedatadatRepository.find({
    where: {
      project: {
        id: projectId,
      },
    },
  });

  return instan;
}
