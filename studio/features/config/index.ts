import { config } from "dotenv";
import * as Minio from "minio";

config({
  override: true,
});

const db = {
  host: process.env["DB_HOST"] || "localhost",
  port: parseInt(process.env["DB_PORT"] || "5432"),
  username: process.env["DB_USERNAME"] || "postgres",
  password: process.env["DB_PASSWORD"] || "postgres",
  database: process.env["DB_DATABASE"] || "postgres",
};

const fileStorage: Minio.ClientOptions = {
  accessKey: process.env["MINIO_ACCESS_KEY"] ?? "",
  secretKey: process.env["MINIO_SECRET_KEY"] ?? "",
  endPoint: process.env["MINIO_ENDPOINT"] ?? "",
  useSSL: false,
  port: parseInt(process.env["MINIO_PORT"] ?? "9000"),
};

export const Config = {
  db,
  fileStorage,
};

console.log(Config);
