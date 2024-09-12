import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Project } from "./project";

@Entity("project_version")
export class ProjectVersion {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Project, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  project?: Project;

  @Column()
  bucketName!: string;

  @Column()
  thumbnailContents!: string;

  @CreateDateColumn() created_at!: Date;
  @UpdateDateColumn() updated_at!: Date;
}
