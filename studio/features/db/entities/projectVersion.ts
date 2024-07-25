import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Project } from "./project";

@Entity("projectVersion")
export class ProjectVersion {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Project, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  project?: Project;

  // get from file system
  file?: string;

  @CreateDateColumn() created_at!: Date;
  @UpdateDateColumn() updated_at!: Date;
}
