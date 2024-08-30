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

  @Column({ nullable: true }) name?: string;

  @Column() bucketName!: string;

  @ManyToOne(() => Project, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  project?: Project;

  @Column() thumbnailContents!: string;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
}
