import { DataSource, EntityTarget, ObjectLiteral } from "typeorm";
import { AppDataSource } from "./data-source";

let dataSource: DataSource;

export async function initDatabase() {
  if (!dataSource) {
    dataSource = await AppDataSource.initialize();
  }

  return dataSource;
}

export async function injectRepository<T extends ObjectLiteral>(
  entity: EntityTarget<T>
) {
  const dataSource = await initDatabase();
  return dataSource.getRepository(entity);
}