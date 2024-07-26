import { ZipArchive } from "@shortercode/webzip";

export async function readFileZipContents(
  blob: Blob,
  fileMap: Map<string, Blob>,
) {
  const archive = await ZipArchive.from_blob(blob);
  const iterator = archive.files();

  //iterate over the contents of the zip archive
  let next = iterator.next();
  while (!next.done) {
    const [fileName, zipEntry] = next.value;
    const fileContents = await zipEntry.get_blob();
    fileMap.set(fileName, fileContents);
    next = iterator.next();
  }
}
