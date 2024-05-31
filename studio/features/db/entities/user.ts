import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Model } from "./model";
import { Project } from "./project";

@Entity()
export class User {
  @PrimaryColumn() id!: string;

  @Column() email!: string;
  @Column({ nullable: true }) picture?: string;

  @OneToMany(() => Project, (project) => project.user)
  projects!: Project[];

  @OneToMany(() => Model, (model) => model.user)
  models!: Model[];
}
