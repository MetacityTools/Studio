export function getModelBucketName(modelId: string | number) {
  return `models/${modelId}`;
}

export function getEmbedBucketName(embedId: string | number) {
  return `embeds/${embedId}`;
}

export function getProjectVersionBucketName(projectVersionId: string | number) {
  return `projects/${projectVersionId}`;
}
