import getModelArchive from "@features/api-sdk/getModelArchive";

export async function downloadModelArchiveFile(modelId: number) {
  const data = await getModelArchive(modelId);
  const link = document.createElement("a");
  link.href = URL.createObjectURL(data);
  link.download = "model.zip";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
