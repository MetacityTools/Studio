import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Model } from "./model";
import { Project } from "./project";
import { User } from "./user";

@Entity("model_metadata")
export class ModelMetadata {
  @PrimaryColumn() model_id!: number;
  @PrimaryColumn() project_id!: number;
  @PrimaryColumn() user_id!: string;
  @PrimaryColumn("varchar") key!: string;

  @Column("varchar", { nullable: true }) value?: string | null;
  @Column("varchar", { nullable: false }) type!: string;

  @ManyToOne(() => Model, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "model_id" })
  model?: Model;

  @ManyToOne(() => Project, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "project_id" })
  project?: Project;

  @ManyToOne(() => User, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user?: User;
}
