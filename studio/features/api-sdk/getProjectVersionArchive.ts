import axios from "axios";

export default async function getProjectVersionArchive(projectVersion: number) {
  const response = await axios
    .get(`/api/projectVersions/${projectVersion}/data`)
    .then((res) => res.data);
  const data = await response.blob();
  return data;
}
