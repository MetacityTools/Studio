// MK: this is a file with functions that check specific user permissions
import { getUser } from "./user";

export async function canAccessProjects() {
  const user = await getUser();
  return !!user;
}
