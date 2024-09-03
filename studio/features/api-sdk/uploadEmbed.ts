import axios from "axios";

export default async function uploadEmbed(
  projectId: number,
  dataFile: File,
  thumbnailFileContents: string,
  name: string,
) {
  const formData = new FormData();

  formData.append("projectId", projectId.toString());
  formData.append("dataFile", dataFile);
  formData.append("thumbnailFileContents", thumbnailFileContents);
  formData.append("name", name);

  const response = await axios.post("/api/embeds", formData);

  return response;
}
