// MK: this is a file with functions that check specific user permissions
import { getUserToken } from "./user";

export async function canCreateProject() {
  const user = await getUserToken();
  return !!user;
}

export async function canReadOwnProjects() {
  const user = await getUserToken();
  return !!user;
}

export async function canEditOwnProject() {
  const user = await getUserToken();
  return !!user;
}
