import { Client } from "minio";
import { Readable } from "node:stream";
import { Config } from "../config";

const client = new Client(Config.fileStorage);

export async function readFile(
  file: string,
  directory: string
): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    const dataStream = await client.getObject(directory, file);
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
  await client.putObject(directory, file, data);
}

export async function readFileStream(file: string, directory: string) {
  return await client.getObject(directory, file);
}

export async function saveFileStream(
  file: string,
  directory: string,
  data: Readable
) {
  return await client.putObject(directory, file, data);
}

export async function deleteFile(file: string, directory: string) {
  await client.removeObject(directory, file);
}

export async function ensureDirectory(directory: string): Promise<void> {
  const bucketExists = await client.bucketExists(directory);
  if (!bucketExists) {
    await client.makeBucket(directory);
  }
}

export async function getFileInfo(file: string, directory: string) {
  return client.statObject(directory, file);
}
