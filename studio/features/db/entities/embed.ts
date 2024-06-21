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

  @Column({ nullable: true }) bucketId?: string;
  @Column({ nullable: true }) version?: string;

  @ManyToOne(() => Project, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  project?: Project;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;

  files?: string[];
}
