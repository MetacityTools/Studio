import { DataSource } from "typeorm";
import { AppDataSource } from "./data-source";

let conn: DataSource;

export async function initDatabase() {
  if (conn) return conn;

  conn = await AppDataSource.initialize();
}
