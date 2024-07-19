import "reflect-metadata";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { Config } from "../config";
import { Embed } from "./entities/embed";
import { Model } from "./entities/model";
import { Project } from "./entities/project";
import { User } from "./entities/user";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: Config.db.host,
  port: Config.db.port,
  username: Config.db.username,
  password: Config.db.password,
  database: Config.db.database,
  synchronize: true,
  logging: ["error"],
  entities: [Project, User, Model, Embed],
  subscribers: [],
  migrations: [],
  namingStrategy: new SnakeNamingStrategy(),
});
