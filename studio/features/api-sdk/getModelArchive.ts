export default async function getModelArchive(modelId: number) {
  const response = await fetch(`/api/models/${modelId}/data`, {
    method: "GET",
  });
  const data = await response.blob();
  return data;
}
