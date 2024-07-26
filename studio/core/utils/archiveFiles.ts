import { readFile } from "@features/storage";
import { ZipArchive } from "@shortercode/webzip";

export default async function archiveFiles(
  fileNames: string[],
  bucketName: string,
) {
  const archive = new ZipArchive();
  for (const fileName of fileNames) {
    const data = await readFile(fileName, bucketName);
    await archive.set(fileName, data);
  }

  return archive;
}
