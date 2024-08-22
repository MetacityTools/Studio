export default async function uploadProjectVerion(
  projectId: number,
  file: File,
) {
  const formData = new FormData();

  formData.append("projectId", projectId.toString());
  formData.append("file", file);

  const response = await fetch("/api/projectVersions", {
    method: "POST",
    body: formData,
  });

  return response;
}
