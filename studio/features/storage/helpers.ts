export function getUserBucketName(userId: string, directory?: string) {
  let userDir = `users/${userId}`;
  if (directory) userDir += `/${directory}`;
  return userDir;
}

export function getUserModelBucketName(
  userId: string,
  modelId: string | number,
) {
  return getUserBucketName(userId, `models/${modelId}`);
}

export function getUserEmbedBucketName(
  userId: string,
  embedId: string | number,
) {
  return getUserBucketName(userId, `embeds/${embedId}`);
}
