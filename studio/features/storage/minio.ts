import { Config } from "@features/config";
import { ZipArchive } from "@shortercode/webzip";
import { Client } from "minio";
import { Readable } from "node:stream";

let client: Client | null = null;

function getClient() {
  if (!client) client = new Client(Config.minio);
  return client;
}

function resolveBucket(bucketName: string) {
  return bucketName.replaceAll(/[^a-z0-9\-]/g, "-");
}

export async function readFile(
  file: string,
  bucketName: string,
): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    const client = getClient();
    const bucket = resolveBucket(bucketName);

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

export async function saveFile(file: string, bucketName: string, data: Buffer) {
  const client = getClient();
  const bucket = resolveBucket(bucketName);
  await client.putObject(bucket, file, data);
}

export async function readFileStream(file: string, bucketName: string) {
  const client = getClient();
  const bucket = resolveBucket(bucketName);
  return await client.getObject(bucket, file);
}

export async function saveFileStream(
  file: string,
  bucketName: string,
  data: Readable,
) {
  const client = getClient();
  const bucket = resolveBucket(bucketName);
  return await client.putObject(bucket, file, data);
}

export async function deleteFile(file: string, bucketName: string) {
  const client = getClient();
  const bucket = resolveBucket(bucketName);

  await client.removeObject(bucket, file);
}

export async function deleteBucket(bucketName: string) {
  const client = getClient();
  const bucket = resolveBucket(bucketName);

  await client.removeBucket(bucket);
}

export async function ensureBucket(bucketName: string): Promise<string> {
  const client = getClient();
  const bucket = resolveBucket(bucketName);

  const bucketExists = await client.bucketExists(bucket);
  if (!bucketExists) {
    await client.makeBucket(bucket);
  }

  return bucketName;
}

export async function checkBucketExists(bucketName: string) {
  const client = getClient();
  const bucket = resolveBucket(bucketName);
  return client.bucketExists(bucket);
}

export async function checkFileExists(file: string, bucketName: string) {
  try {
    const client = getClient();
    const bucket = resolveBucket(bucketName);
    await client.statObject(bucket, file);
    return true;
  } catch (err) {
    return false;
  }
}

export async function getFileInfo(file: string, bucketName: string) {
  const client = getClient();
  const bucket = resolveBucket(bucketName);
  return client.statObject(bucket, file);
}

export async function listFilesInBucket(bucketName: string) {
  return new Promise<string[]>((resolve, reject) => {
    const client = getClient();
    const bucket = resolveBucket(bucketName);
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

export async function getFilesInBucketAsZip(bucketName: string) {
  const files = await listFilesInBucket(bucketName);
  const archive = new ZipArchive();

  for (const file of files) {
    const data = await readFile(file, bucketName);
    await archive.set(file, data);
  }

  return archive;
}
