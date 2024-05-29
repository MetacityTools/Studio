import { config } from "dotenv";

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

export const Config = {
  db,
};
