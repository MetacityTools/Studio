// MK: this is a file with functions that check specific user permissions
import { getUser } from "./user";

export async function canCreateProject() {
  const user = await getUser();
  return !!user;
}

export async function canReadOwnProjects() {
  const user = await getUser();
  return !!user;
}

export async function canEditOwnProject() {
  const user = await getUser();
  return !!user;
}
