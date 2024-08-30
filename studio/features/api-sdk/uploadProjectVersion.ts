import axios from "axios";

export default async function uploadProjectVerion(
  projectId: number,
  dataFile: File,
  thumbnailFileContents: string,
) {
  const formData = new FormData();

  formData.append("projectId", projectId.toString());
  formData.append("dataFile", dataFile);
  formData.append("thumbnailFileContents", thumbnailFileContents);

  const response = await axios.post("/api/projectVersions", formData);

  return response;
}
