export async function fetchModelArchive(modelId: number) {
  const response = await fetch(`/api/models/${modelId}/data`, {
    method: "GET",
  });
  const data = await response.blob();
  return data;
}

export async function downloadModelArchiveFile(modelId: number) {
  const data = await fetchModelArchive(modelId);
  const link = document.createElement("a");
  link.href = URL.createObjectURL(data);
  link.download = "model.zip";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
