import axios from "axios";

export default async function uploadProjectVerion(
  projectId: number,
  file: File,
) {
  const formData = new FormData();

  formData.append("projectId", projectId.toString());
  formData.append("file", file);

  const response = await axios
    .post("/api/projectVersions", formData)
    .then((res) => res.data);

  console.log(response);

  return response;
}
