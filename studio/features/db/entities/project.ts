import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Model } from "./model";
import { User } from "./user";

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column() name!: string;
  @Column() description!: string;

  @ManyToOne(() => User, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  user?: User;

  @ManyToMany(() => Model, (model) => model.projects)
  @JoinTable({ name: "projects_models" })
  models?: Model[];

  @CreateDateColumn() created_at!: Date;
  @UpdateDateColumn() updated_at!: Date;
}
