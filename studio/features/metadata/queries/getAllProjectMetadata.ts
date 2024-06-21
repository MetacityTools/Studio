import { Metadata } from "@features/db/entities/metadata";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";

export async function getAllProjectMetadata(projectId: number) {
  const modelMedatadatRepository = await injectRepository(Metadata);

  const metadata = await modelMedatadatRepository.find({
    where: {
      project: {
        id: projectId,
      },
    },
  });

  return toPlain(metadata);
}
