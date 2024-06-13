import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Model } from "./model";
import { Project } from "./project";
import { User } from "./user";

@Entity("model_metadata")
export class ModelMetadata {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { nullable: false }) key!: string;
  @Column("varchar", { nullable: true }) value?: string | null;
  @Column("varchar", { nullable: true }) type?: string | null;

  @ManyToOne(() => Model)
  model?: Model;

  @ManyToOne(() => Project)
  project?: Project;

  @ManyToOne(() => User)
  user?: User;
}
