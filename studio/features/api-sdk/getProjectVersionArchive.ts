export default async function getProjectVersionArchive(projectVersion: number) {
  const response = await fetch(`/api/projectVersions/${projectVersion}/data`, {
    method: "GET",
  });
  const data = await response.blob();
  return data;
}
