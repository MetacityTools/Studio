import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Project } from "./project";

@Entity("embeds")
export class Embed {
  @PrimaryGeneratedColumn() id!: number;

  @Column() geometryFile!: string;
  @Column() metadataFile!: string;
  @Column() styleFile!: string;

  @ManyToOne(() => Project)
  project?: Project;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
}
