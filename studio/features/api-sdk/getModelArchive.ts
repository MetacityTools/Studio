import axios from "axios";

export default async function getModelArchive(modelId: number) {
  const data = await axios
    .get<Blob>(`/api/models/${modelId}/data`, { responseType: "blob" })
    .then((res) => res.data);
  return data;
}
