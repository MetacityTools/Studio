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
  logging: ["error"],
  entities: [Project, User, Model, Embed, ProjectVersion],
  subscribers: [],
  migrationsRun: Config.production ? true : false,
  migrations: [__dirname + "/migrations/*.js"],
  namingStrategy: new SnakeNamingStrategy(),
});
