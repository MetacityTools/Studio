import { Config } from "@features/config";
import { Client } from "minio";
import { Readable } from "node:stream";

let client: Client | null = null;

function getClient() {
  if (!client) client = new Client(Config.minio);
  return client;
}

function resolveBucket(directory: string) {
  return directory.replaceAll(/[^a-z0-9\-]/g, "-");
}

export async function readFile(
  file: string,
  directory: string,
): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    const client = getClient();
    const bucket = resolveBucket(directory);

    const dataStream = await client.getObject(bucket, file);
    // Create an empty Buffer to store the object data
    let buffer = Buffer.from([]);

    // Get the object and append the data to the buffer
    dataStream.on("data", (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
    });

    dataStream.on("end", () => resolve(buffer));

    dataStream.on("error", (err) => reject(err));
  });
}

export async function saveFile(file: string, directory: string, data: Buffer) {
  const client = getClient();
  const bucket = resolveBucket(directory);
  await client.putObject(bucket, file, data);
}

export async function readFileStream(file: string, directory: string) {
  const client = getClient();
  const bucket = resolveBucket(directory);
  return await client.getObject(bucket, file);
}

export async function saveFileStream(
  file: string,
  directory: string,
  data: Readable,
) {
  const client = getClient();
  const bucket = resolveBucket(directory);
  return await client.putObject(bucket, file, data);
}

export async function deleteFile(file: string, directory: string) {
  const client = getClient();
  const bucket = resolveBucket(directory);

  await client.removeObject(bucket, file);
}

export async function deleteBucket(directory: string) {
  const client = getClient();
  const bucket = resolveBucket(directory);

  await client.removeBucket(bucket);
}

export async function ensureBucket(directory: string): Promise<string> {
  const client = getClient();
  const bucket = resolveBucket(directory);

  const bucketExists = await client.bucketExists(bucket);
  if (!bucketExists) {
    await client.makeBucket(bucket);
  }

  return directory;
}

export async function checkBucketExists(directory: string) {
  const client = getClient();
  const bucket = resolveBucket(directory);
  return client.bucketExists(bucket);
}

export async function checkFileExists(file: string, directory: string) {
  try {
    const client = getClient();
    const bucket = resolveBucket(directory);
    await client.statObject(bucket, file);
    return true;
  } catch (err) {
    return false;
  }
}

export async function getFileInfo(file: string, directory: string) {
  const client = getClient();
  const bucket = resolveBucket(directory);
  return client.statObject(bucket, file);
}

export async function listFilesInBucket(directory: string) {
  return new Promise<string[]>((resolve, reject) => {
    const client = getClient();
    const bucket = resolveBucket(directory);
    const files: string[] = [];
    const objectStream = client.listObjects(bucket);

    objectStream.on("data", (obj) => {
      if (obj.name) files.push(obj.name);
    });

    objectStream.on("end", () => resolve(files));

    objectStream.on("error", (err) => {
      console.error(err);
      reject(err);
    });
  });
}
