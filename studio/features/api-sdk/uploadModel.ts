import axios from "axios";

export default async function uploadModel(name: string, files: File[]) {
  const formData = new FormData();

  formData.append("name", name);
  for (const file of files) {
    formData.append("files", file);
  }

  const response = await axios
    .post("/api/models", formData)
    .then((res) => res.data);

  return response;
}
