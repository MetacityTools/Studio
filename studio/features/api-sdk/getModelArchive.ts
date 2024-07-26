import axios from "axios";

export default async function getModelArchive(modelId: number) {
  const response = await axios
    .get(`/api/models/${modelId}/data`)
    .then((res) => res.data);
  const data = await response.blob();
  return data;
}
