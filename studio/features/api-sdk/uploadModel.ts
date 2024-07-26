export default async function uploadModel(name: string, files: File[]) {
  const formData = new FormData();

  formData.append("name", name);
  for (const file of files) {
    formData.append("files", file);
  }

  const response = await fetch("/api/models", {
    method: "POST",
    body: formData,
  });

  return response;
}
