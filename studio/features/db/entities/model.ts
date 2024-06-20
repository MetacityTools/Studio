import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Project } from "./project";
import { User } from "./user";

@Entity("models")
export class Model {
  @PrimaryGeneratedColumn() id!: number;

  @Column() name!: string;
  @Column("varchar", { nullable: true }) coordinateSystem?: string | null;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  user?: User;

  @ManyToMany(() => Project, (project) => project.models)
  projects?: Project[];

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;

  // get from file system
  files?: string[];
}
