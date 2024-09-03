import axios from "axios";

export default async function getEmbedArchive(embedId: number) {
  const data = await axios
    .get<Blob>(`/api/embeds/${embedId}/data`, {
      responseType: "blob",
    })
    .then((res) => res.data);
  return data;
}
