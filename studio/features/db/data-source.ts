import "reflect-metadata";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { Config } from "../config";
import { Embed } from "./entities/embed";
import { Model } from "./entities/model";
import { Project } from "./entities/project";
import { ProjectVersion } from "./entities/projectVersion";
import { User } from "./entities/user";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: Config.db.host,
  port: Config.db.port,
  username: Config.db.username,
  password: Config.db.password,
  database: Config.db.database,
  entities: [Project, User, Model, Embed, ProjectVersion],
  namingStrategy: new SnakeNamingStrategy(),
  logging: ["error"],
  subscribers: [],
  // workaround to get vitest work with migrations (CommonJS vs ESM issue)
  migrations: Config.environment === "test" ? undefined : ["features/db/migrations/*.ts"],
});
