import axios from "axios";

export default async function getProjectVersionArchive(projectVersion: number) {
  const data = await axios
    .get<Blob>(`/api/projectVersions/${projectVersion}/data`, {
      responseType: "blob",
    })
    .then((res) => res.data);
  return data;
}
