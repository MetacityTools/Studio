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

  @Column() bucketId!: string;
  @Column() version!: string;

  @ManyToOne(() => Project)
  project?: Project;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;

  files?: string[];
}
