// MK: this is a file with functions that check specific user permissions
import { getUserToken } from "./user";

export async function canCreateProject() {
  const user = await getUserToken();
  return !!user;
}

export async function canReadProjects() {
  const user = await getUserToken();
  return !!user;
}

export async function canEditProject() {
  const user = await getUserToken();
  return !!user;
}

export async function canCreateModel() {
  const user = await getUserToken();
  return !!user;
}

export async function canReadModels() {
  const user = await getUserToken();
  return !!user;
}

export async function canEditModel() {
  const user = await getUserToken();
  return !!user;
}

export async function canEditModelMetadata() {
  const user = await getUserToken();
  return !!user;
}
