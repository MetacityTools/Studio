export function getUserDirectory(userId: string, directory?: string) {
  let userDir = `users/${userId}`;
  if (directory) userDir += `/${directory}`;
  return userDir;
}

export function getUserModelDirectory(
  userId: string,
  modelId: string | number
) {
  return getUserDirectory(userId, `models/${modelId}`);
}
