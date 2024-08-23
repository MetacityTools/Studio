export default async function uploadProjectVerion(
  projectId: number,
  dataFile: File,
  thumbnailFileContents: string,
) {
  const formData = new FormData();

  formData.append("projectId", projectId.toString());
  formData.append("dataFile", dataFile);
  formData.append("thumbnailFileContents", thumbnailFileContents);

  const response = await fetch("/api/projectVersions", {
    method: "POST",
    body: formData,
  });

  return response;
}
